import {inject, singleton}          from 'aurelia-framework';
import {withModal}       from '../shared/decorators';
import {ProjectFinder}   from '../shared/project-finder';
import {ScaffoldProject} from '../scaffolding/scaffold-project';

@inject(ProjectFinder)
@singleton()
export class Main {
  constructor(projectFinder) {
    this.projectFinder = projectFinder;
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
