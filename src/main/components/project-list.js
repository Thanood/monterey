import {inject, bindable} from 'aurelia-framework';
import {ProjectManager}   from '../../shared/project-manager';

@inject(ProjectManager)
export class ProjectList {
  @bindable selectedProject;
  @bindable disabled = false;

  constructor(projectManager) {
    this.state = projectManager.state;
  }

  attached() {
    // automatically select the first project
    this.selectedProject = this.state.projects[0];
  }

  selectProject(project) {
    if (this.disabled) {
      alert('Please return to the tile list before switching projects');
      return;
    }

    this.selectedProject = project;
  }
}
