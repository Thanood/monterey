import {inject, singleton} from 'aurelia-framework';
import {withModal}         from '../shared/decorators';
import {ProjectFinder}     from '../shared/project-finder';
import {TaskManager}       from '../shared/task-manager';
import {ScaffoldProject}   from '../scaffolding/scaffold-project';

@inject(ProjectFinder, TaskManager)
@singleton()
export class Main {
  constructor(projectFinder, taskManager) {
    this.projectFinder = projectFinder;
    this.taskManager = taskManager;
  }

  async addProject() {
    await this.projectFinder.openDialog();
  }

  @withModal(ScaffoldProject)
  createProject() {}

  addTask() {
    let task = {
      promise: new Promise(resolve => {
        setTimeout(() => resolve(), 5000000);
      }),
      logs: [],
      title: 'test'
    };
    this.taskManager.addTask(task);
    // setInterval(() => task.logs.push('logged something'), 1000);

    this.taskManager.addTask({
      promise: new Promise(resolve => {
        setTimeout(() => resolve(), 10000);
      }),
      title: 'baz'
    });


    this.taskManager.addTask({
      promise: new Promise(resolve => {
        setTimeout(() => resolve(), 5000);
      }),
      title: 'bar'
    });


    this.taskManager.addTask({
      promise: new Promise(resolve => {
        setTimeout(() => resolve(), 3000);
      }),
      title: 'Foo'
    });
  }

  activateScreen(viewModelPath) {
    this._activePluginScreen = viewModelPath;
  }

  returnToPluginList() {
    this._activePluginScreen = '';
  }
}
