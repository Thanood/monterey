import {autoinject, bindable}            from 'aurelia-framework';
import {ApplicationState}                from '../../shared/application-state';
import {Project}                         from '../../shared/project';
import {Notification}                    from '../../shared/notification';
import {SelectedProject}                 from '../../shared/selected-project';
import {EventAggregator, Subscription}   from 'aurelia-event-aggregator';

@autoinject()
export class ProjectList {
  @bindable disabled = false;
  projectRemoved: Subscription;
  projectAdded: Subscription;

  projectGrid;
  // keeps the index of the last selected row
  lastSelectedRow = 0;

  constructor(private state: ApplicationState,
              private notification: Notification,
              private selectedProject: SelectedProject,
              private ea: EventAggregator) {
    this.projectRemoved = ea.subscribe('ProjectRemoved', () => this.select(0));
    this.projectAdded = ea.subscribe('ProjectAdded', (project) => {
      let index = this.state.projects.indexOf(project);
      this.select(index);
    });
  }

  attached() {
    setTimeout(() => {
      // has a project been selected in a previous session?
      // if so, select this project again
      if (this.state.selectedProjectPath) {
        let index = this.state.projects.findIndex(x => x.path === this.state.selectedProjectPath);
        if (index > -1) {
          this.select(index);
        }
      } else {
        // select first row
        this.select(0);
      }
    });
  }

  select(index) {
    if (this.state.projects.length > index) {
      this.selectedProject.set(this.state.projects[index]);

      this.projectGrid.ctx.vGridSelection.select(index);
      this.projectGrid.ctx.vGridGenerator.updateSelectionOnAllRows();
    } else {
      this.selectedProject.set(null);
    }
  }

  projectClicked(project) {
    if (this.selectedProject.current !== project.data) {
      this.lastSelectedRow = project.row;
      this.selectedProject.set(project.data);
    }
  }

  detached() {
    this.projectRemoved.dispose();
    this.projectAdded.dispose();
  }
}
