import {inject, bindable} from 'aurelia-framework';
import {ProjectManager}   from '../../shared/project-manager';

@inject(ProjectManager)
export class ProjectList {
  @bindable selectedProject;

  constructor(projectManager) {
    this.state = projectManager.state;
  }

  attached() {
    this.selectedProject = this.state.projects[0];
  }
}
