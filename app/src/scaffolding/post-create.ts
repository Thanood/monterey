import {autoinject, LogManager} from 'aurelia-framework';
import {Logger}                 from 'aurelia-logging';
import {DialogService}          from 'aurelia-dialog';
import {IStep}                  from './istep';
import {FS}                     from 'monterey-pal';
import {ProjectManager}         from '../shared/project-manager';
import {Notification}           from '../shared/notification';
import {Project}                from '../shared/project';
import {TaskManager}            from '../plugins/task-manager/task-manager';
import {TaskManagerModal}       from '../plugins/task-manager/task-manager-modal';
import {Task}                   from '../plugins/task-manager/task';
import {Common as CommonNPM}    from '../plugins/npm/common';
import {Common as CommonJSPM}   from '../plugins/jspm/common';
import {TaskRunner}             from '../plugins/task-manager/task-runner';

const logger = <Logger>LogManager.getLogger('PostCreate');

@autoinject()
export class PostCreate {
  state;
  step: IStep;
  actions: Array<Action> = [];
  project: Project;
  tasks: Array<Task> = [];

  constructor(private projectManager: ProjectManager,
              private dialogService: DialogService,
              private notification: Notification,
              private taskRunner: TaskRunner,
              private taskManager: TaskManager,
              private commonNPM: CommonNPM,
              private commonJSPM: CommonJSPM) {}

  async activate(model) {
    this.state = model.state;
    this.step = model.step;
    this.step.execute = () => this.execute();
    this.step.previous = () => this.previous();

    await this.addProject();

    this.determineActions();
  }

  determineActions() {
    this.actions = [{
      name: 'npm install',
      display: 'Install NPM dependencies',
      checked: true
    }];

    if (this.project.isUsingJSPM()) {
      this.actions.push({
        name: 'jspm install',
        display: 'Install JSPM dependencies',
        checked: true
      });
    }

    if (this.project.isUsingAureliaCLI()) {
      this.actions.push({
        name: 'start cli',
        display: 'Start the project (au run --watch)',
        checked: true
      });
    }

    if (this.project.isUsingGulp()) {
      this.actions.push({
        name: 'start gulp',
        display: 'Start the project (gulp watch)',
        checked: true
      });
    }

    if (this.project.isUsingWebpack()) {
      this.actions.push({
        name: 'start webpack',
        display: 'Start the project (npm start)',
        checked: true
      });
    }

    this.updateCloseBtnText();
  }

  async addProject() {
    this.state.path = FS.join(this.state.path, this.state.name);

    let proj = await this.projectManager.addProjectByWizardState(this.state);

    if (proj) {
      this.project = <Project>proj;
      this.step.project = this.project;
    }
  }

  onCheck(action: Action) {

    // can't do anything without npm install first
    if (action.name === 'npm install') {
      if (!action.checked) {
        this.actions.forEach(x => x.checked = false);
      }
    } else {
      if (!this.actions.find(x => x.name === 'npm install').checked) {
        action.checked = false;
        this.notification.warning('It is necessary to install NPM dependencies before anything else can be done');
      }
    }

    this.updateCloseBtnText();
  }

  updateCloseBtnText() {
    this.step.closeBtnText = this.actions.filter(x => x.checked).length > 0 ? 'Start' : 'Close';
  }

  async execute() {
    let checkedActions = this.actions.filter(x => x.checked);
    this.tasks = [];
    
    if (checkedActions.find(x => x.name === 'npm install')) {
      this.tasks.push(this.commonNPM.installNPMDependencies(this.project));
    }

    if (checkedActions.find(x => x.name === 'jspm install')) {
      let t = this.commonJSPM.install(this.project, true, { lock: true }, true);
      t.dependsOn = this.tasks[this.tasks.length - 1];
      this.tasks.push(t);
    }

    if (checkedActions.find(x => x.name === 'start cli')) {
      this.tasks.push(this.loadTasks());
      this.tasks.push(this.runProjectTask('au run --watch'));
    }

    if (checkedActions.find(x => x.name === 'start gulp')) {
      this.tasks.push(this.loadTasks());
      this.tasks.push(this.runProjectTask('gulp watch'));
    }

    if (checkedActions.find(x => x.name === 'start webpack')) {
      this.tasks.push(this.loadTasks());
      this.tasks.push(this.runProjectTask('npm start'));
    }

    if (this.tasks.length > 0) {
      logger.info(`${checkedActions.length} (${checkedActions.map(x => x.display).join(', ')}) were checked`);

      this.taskManager.startTask(this.tasks[0]);
      this.dialogService.open({ viewModel: TaskManagerModal, model: { task: this.tasks[0] } })
    }

    return {
      goToNextStep: true
    };
  }

  // loads tasks like `gulp watch` or `au run --watch`
  // needed before running such task
  loadTasks() {
    let t = new Task(this.project, 'Loading project tasks', () => this.taskRunner.load(this.project, false));
    t.dependsOn = this.tasks[this.tasks.length - 1];
    this.taskManager.addTask(this.project, t);
    return t;
  } 

  runProjectTask(command: string) {
    let t = this.taskRunner.runByCmd(this.project, command);
    t.dependsOn = this.tasks[this.tasks.length - 1];
    this.taskManager.addTask(this.project, t);
    return t;
  }

  async previous() {
    return {
      goToPreviousStep: true
    };
  }
}

export interface Action {
  name: string;
  display: string;
  checked: boolean;
}