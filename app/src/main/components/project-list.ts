import {inject, bindable} from 'aurelia-framework';
import {ProjectManager}   from '../../shared/project-manager';

@inject(ProjectManager)
export class ProjectList {
  @bindable selectedProject;
  @bindable disabled = false;
  state;

  //grid context
  projectGrid = {};
  //last selected, so we can change back if we need to
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
    setTimeout(()=>{ //<-- on attached the grid is made, so wee need to delay to next
      this.projectGrid.ctx.vGridSelection.select(this.lastSelectedRow);
      this.projectGrid.ctx.vGridGenerator.updateSelectionOnAllRows();
    });
  }

  selectProject(project) {
    if(this.selectedProject !==project.data){
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
