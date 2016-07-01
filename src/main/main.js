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

  activateScreen(viewModelPath) {
    this._activePluginScreen = viewModelPath;
  }

  returnToPluginList() {
    this._activePluginScreen = '';
  }
}
