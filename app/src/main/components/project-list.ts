import {inject, bindable} from 'aurelia-framework';
import {ProjectManager}   from '../../shared/project-manager';

@inject(ProjectManager)
export class ProjectList {
  @bindable selectedProject;
  @bindable disabled = false;
  state;

  projectGrid;
  // keeps the index of the last selected row
  lastSelectedRow = 0;

  constructor(projectManager) {
    this.state = projectManager.state;
  }

  attached() {
    // automatically select the first project
    this.selectedProject = this.state.projects[this.lastSelectedRow];
    this.setlastSelectedRow();
  }

  setlastSelectedRow(){
     // on attached the grid is made, so we need to delay to next
    setTimeout(() => {
      this.projectGrid.ctx.vGridSelection.select(this.lastSelectedRow);
      this.projectGrid.ctx.vGridGenerator.updateSelectionOnAllRows();
    });
  }

  selectProject(project) {
    if(this.selectedProject !== project.data) {
      if (this.disabled) {
        alert('Please return to the tile list before switching projects');
        this.setlastSelectedRow();
        return;
      } else {
        this.lastSelectedRow = project.row;
        this.selectedProject = project.data;
      }

    }
  }
}
