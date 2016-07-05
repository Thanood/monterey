import {inject}          from 'aurelia-framework';
import {Router}          from 'aurelia-router';
import {withModal}       from '../shared/decorators';
import {ProjectFinder}   from '../shared/project-finder';
import {ScaffoldProject} from '../scaffolding/scaffold-project';

@inject(ProjectFinder, Router)
export class Landing {

  constructor(projectFinder, router) {
    this.projectFinder = projectFinder;
    this.router = router;
  }

  async open() {
    if (await this.projectFinder.openDialog()) {
      this.router.navigateToRoute('main');
    }
  }

  @withModal(ScaffoldProject)
  create(projectPath) {
    this.router.navigateToRoute('main');
  }
}
