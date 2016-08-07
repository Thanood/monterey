import {autoinject}           from 'aurelia-framework';
import {DialogService}        from 'aurelia-dialog';
import {IStep}                from './istep';
import {FS}                   from 'monterey-pal';
import {ProjectManager}       from '../shared/project-manager';
import {Notification}         from '../shared/notification';
import {Project}              from '../shared/project';
import {TaskManagerModal}     from '../plugins/task-manager/task-manager-modal';
import {Common as CommonNPM}  from '../plugins/npm/common';
import {Common as CommonJSPM} from '../plugins/jspm/common';
import {TaskRunner}           from '../plugins/task-runner/task-runner';

@autoinject()
export class PostCreate {
  state;
  step: IStep;
  actions: Array<Action> = [];
  project: Project;

  constructor(private projectManager: ProjectManager,
              private dialogService: DialogService,
              private notification: Notification,
              private taskRunner: TaskRunner,
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

    // this.actions.push({
    //   display: 'open project in',
    //   checked: true,
    //   options: [{
    //     name: 'Visual Studio Code',
    //     value: 'Visual Studio'
    //   }, {
    //     name: 'Atom',
    //     value: 'Atom'
    //   }]
    // });
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
  }

  async execute() {
    let promise = new Promise(resolve => resolve());

    let checkedActions = this.actions.filter(x => x.checked);

    console.log(checkedActions);
    if (checkedActions.find(x => x.name === 'npm install')) {
      promise = promise.then(() => {
        console.log('running npm install');
        let task = this.commonNPM.installNPMDependencies(this.project);

        return task.promise;
      });
    }

    if (checkedActions.find(x => x.name === 'jspm install')) {
      promise = promise.then(() => {
        console.log('running jspm install');
        let task = this.commonJSPM.install(this.project, true, { lock: true }, true);

        return task.promise;
      });
    }

    if (checkedActions.find(x => x.name === 'start cli')) {
      promise = promise.then(async () => {
        let service = this.taskRunner.getService(this.project);
        await this.taskRunner._loadTasks(this.project, this.project.__meta__.taskrunner, service, false);
        let tasks = this.project.__meta__.taskrunner.tasks;
        let cmd = tasks.find(x => x.parameters.length === 2 && x.parameters[0] === 'run' && x.parameters[1] === '--watch');

        this.taskRunner.run(cmd, this.project, service);
      });
    }

    if (checkedActions.find(x => x.name === 'start gulp')) {
      promise = promise.then(async () => {
        let service = this.taskRunner.getService(this.project);
        await this.taskRunner._loadTasks(this.project, this.project.__meta__.taskrunner, service, false);
        let cmd = this.project.__meta__.taskrunner.tasks.find(x => x.parameters[0] === 'watch');

        this.taskRunner.run(cmd, this.project, service);
      });
    }

    if (checkedActions.length > 0) {
      this.notification.success('Monterey will now execute all actions. The progress can be followed through the task manager (in the taskbar)');
    }

    promise = promise.then(() => {
      console.log('all done');
      this.notification.success(`Ran all tasks for project "${this.project.name}"`);
    });

    return {
      goToNextStep: true
    };
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