import {autoinject, LogManager} from 'aurelia-framework';
import {Container}              from 'aurelia-framework';
import {Logger}                 from 'aurelia-logging';
import {DialogService}          from 'aurelia-dialog';
import {FS}                     from 'monterey-pal';
import {IStep}                  from './istep';
import {ProjectManager}         from '../shared/project-manager';
import {PluginManager}          from '../shared/plugin-manager';
import {Notification}           from '../shared/notification';
import {Project}                from '../shared/project';
import {TaskManager}            from '../plugins/task-manager/task-manager';
import {TaskManagerModal}       from '../plugins/task-manager/task-manager-modal';
import {Task}                   from '../plugins/task-manager/task';

import {Plugin as JSPMPlugin}    from '../plugins/jspm/index';
import {Plugin as NPMPlugin}     from '../plugins/npm/index';
import {Plugin as CLIPlugin}     from '../plugins/aurelia-cli/index';
import {Plugin as GulpPlugin}    from '../plugins/gulp/index';
import {Plugin as WebpackPlugin} from '../plugins/webpack/index';
import {BasePlugin}              from '../plugins/base-plugin';

const logger = <Logger>LogManager.getLogger('PostCreate');

@autoinject()
export class PostCreate {
  state;
  step: IStep;
  actions: Array<Task> = [];
  project: Project;
  // tasks: Array<Task> = [];

  constructor(private projectManager: ProjectManager,
              private pluginManager: PluginManager,
              private container: Container,
              private dialogService: DialogService,
              private notification: Notification,
              private taskManager: TaskManager) {}

  async activate(model) {
    this.state = model.state;
    this.step = model.step;
    this.step.execute = () => this.execute();
    this.step.previous = () => this.previous();

    await this.addProject();

    await this.determineActions();
  }

  async determineActions() {

    // in this order the actions will be showed
    let plugins = [NPMPlugin, JSPMPlugin, WebpackPlugin, GulpPlugin, CLIPlugin];
    let actions = [];

    for (let x = 0; x < plugins.length; x++) {
      let plugin = <BasePlugin>this.container.get(plugins[x]);
      actions = actions.concat((await plugin.getPostInstallTasks(this.project)));
    }

    // remove undefined
    actions = actions.filter(x => x); 

    // check all by default
    actions.forEach(action => action.checked = true);

    this.actions = actions;

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

  onCheck(action: Task) {

    // can't do anything without npm install first
    // if (action.name === 'npm install') {
    //   if (!action.checked) {
    //     this.actions.forEach(x => x.checked = false);
    //   }
    // } else {
    //   if (!this.actions.find(x => x.name === 'npm install').checked) {
    //     action.checked = false;
    //     this.notification.warning('It is necessary to install NPM dependencies before anything else can be done');
    //   }
    // }

    // uncheck all actions below this one
    if (!(<any>action).checked) {
      let index = this.actions.indexOf(action);

      for(let x = index; x < this.actions.length; x++) {
        (<any>this.actions[x]).checked = false;
      }
    }

    // make sure that all actions above this one have been checked
    if ((<any>action).checked) {
      let index = this.actions.indexOf(action);

      for(let x = 0; x < index; x++) {
        if (!(<any>this.actions[x]).checked) {
          (<any>action).checked = false;
          this.notification.warning(`It is necessary to "${this.actions[x].title}" before this can be done`);
          return;
        }
      }
    }

    this.updateCloseBtnText();
  }

  updateCloseBtnText() {
    this.step.closeBtnText = this.actions.filter(x => (<any>x).checked).length > 0 ? 'Start' : 'Close';
  }

  async execute() {
    let checked = this.actions.filter(x => (<any>x).checked);

    if (checked.length > 0) {
      logger.info(`${checked.length} (${checked.map(x => x.title).join(', ')}) were checked`);

      let previousTask;

      // add task dependencies
      checked.forEach(task => {
        task.dependsOn = previousTask;
        previousTask = task;
        this.taskManager.addTask(this.project, task);
      });

      this.taskManager.startTask(checked[0]);

      this.dialogService.open({ viewModel: TaskManagerModal, model: { task: checked[0] } });
    }

    
    // let checkedActions = this.actions.filter(x => x.checked);
    // this.tasks = [];
    
    // if (checkedActions.find(x => x.name === 'npm install')) {
    //   this.tasks.push(this.commonNPM.installNPMDependencies(this.project));
    // }

    // if (checkedActions.find(x => x.name === 'jspm install')) {
    //   let t = this.commonJSPM.install(this.project, true, { lock: true }, true);
    //   t.dependsOn = this.tasks[this.tasks.length - 1];
    //   this.tasks.push(t);
    // }

    // if (checkedActions.find(x => x.name === 'start cli')) {
    //   this.tasks.push(this.loadTasks());
    //   this.tasks.push(this.runCommand('au run --watch'));
    // }

    // if (checkedActions.find(x => x.name === 'start gulp')) {
    //   this.tasks.push(this.loadTasks());
    //   this.tasks.push(this.runCommand('gulp watch'));
    // }

    // if (checkedActions.find(x => x.name === 'start webpack')) {
    //   this.tasks.push(this.loadTasks());
    //   this.tasks.push(this.runCommand('npm start'));
    // }

    // if (this.tasks.length > 0) {
    //   logger.info(`${checkedActions.length} (${checkedActions.map(x => x.display).join(', ')}) were checked`);

    //   this.taskManager.startTask(this.tasks[0]);
    //   this.dialogService.open({ viewModel: TaskManagerModal, model: { task: this.tasks[0] } })
    // }

    return {
      goToNextStep: true
    };
  }

  // loads tasks like `gulp watch` or `au run --watch`
  // needed before running such task
  // loadTasks() {
  //   let t = new Task(this.project, 'Loading project tasks', () => this.commandRunner.load(this.project, false));
  //   t.dependsOn = this.tasks[this.tasks.length - 1];
  //   this.taskManager.addTask(this.project, t);
  //   return t;
  // } 

  // runCommand(command: string) {
  //   let t = this.commandRunner.runByCmd(this.project, command);
  //   t.dependsOn = this.tasks[this.tasks.length - 1];
  //   this.taskManager.addTask(this.project, t);
  //   return t;
  // }

  async previous() {
    return {
      goToPreviousStep: true
    };
  }

  sortByTitle(arr, titles) {
    return arr.sort((a, b) => titles.indexOf(a.title) - titles.indexOf(b.title));
  }
}

export interface Action {
  name: string;
  display: string;
  checked: boolean;
}

