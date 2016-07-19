import {autoinject, bindable} from 'aurelia-framework';
import {ApplicationState}     from '../../shared/application-state';
import {Project}              from '../../shared/project';
import {Notification}         from '../../shared/notification';

@autoinject()
export class ProjectList {
  @bindable selectedProject: Project;
  @bindable disabled = false;

  projectGrid;
  // keeps the index of the last selected row
  lastSelectedRow = 0;

  constructor(private state: ApplicationState,
              private notification: Notification) {
  }

  attached() {
    // automatically select the first project
    this.selectedProject = this.state.projects[this.lastSelectedRow];
    this.setlastSelectedRow();
  }

  setlastSelectedRow() {
     // on attached the grid is made, so we need to delay to next
    setTimeout(() => {
      this.projectGrid.ctx.vGridSelection.select(this.lastSelectedRow);
      this.projectGrid.ctx.vGridGenerator.updateSelectionOnAllRows();
    });
  }

  selectProject(project) {
    if (this.selectedProject !== project.data) {
      if (this.disabled) {
        this.notification.error('Please return to the tile list before switching projects');
        this.setlastSelectedRow();
        return;
      } else {
        this.lastSelectedRow = project.row;
        this.selectedProject = project.data;
      }
    }
  }
}
