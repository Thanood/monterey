import {inject}          from 'aurelia-framework';
import {withModal}       from '../shared/decorators';
import {ProjectFinder}   from '../shared/project-finder';
import {ScaffoldProject} from '../scaffolding/scaffold-project';

@inject(ProjectFinder)
export class Main {

  constructor(projectFinder) {
    this.projectFinder = projectFinder;
  }

  async addProject() {
    await this.projectFinder.openDialog();
  }

  @withModal(ScaffoldProject)
  createProject() {}
}
