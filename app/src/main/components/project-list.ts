import {autoinject, bindable}          from 'aurelia-framework';
import {ApplicationState}              from '../../shared/application-state';
import {Project}                       from '../../shared/project';
import {Notification}                  from '../../shared/notification';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';

@autoinject()
export class ProjectList {
  @bindable selectedProject: Project;
  @bindable disabled = false;
  projectRemoved: Subscription;
  projectAdded: Subscription;

  projectGrid;
  // keeps the index of the last selected row
  lastSelectedRow = 0;

  constructor(private state: ApplicationState,
              private notification: Notification,
              private ea: EventAggregator) {
    this.projectRemoved = ea.subscribe('ProjectRemoved', () => this.select(0));
    this.projectAdded = ea.subscribe('ProjectAdded', (project) => {
      let index = this.state.projects.indexOf(project);
      this.select(index);
    });
  }

  attached() {
    setTimeout(() => {
      // select first row
      this.select(0);
    });
  }

  select(index) {
    if (this.state.projects.length > index) {
      this.selectedProject = this.state.projects[index];

      this.projectGrid.ctx.vGridSelection.select(index);
      this.projectGrid.ctx.vGridGenerator.updateSelectionOnAllRows();
    } else {
      this.selectedProject = null;
    }

    this.publishChange();
  }

  projectClicked(project) {
    if (this.selectedProject !== project.data) {
      if (this.disabled) {
        this.notification.error('Please return to the tile list before switching projects');
        this.select(this.lastSelectedRow);
        return;
      } else {
        this.lastSelectedRow = project.row;
        this.selectedProject = project.data;
      }
    }

    this.publishChange();
  }

  publishChange() {
    // allow for the binding to Main to be updated
    // as parts of monterey get the selected project from Main
    setTimeout(() => this.ea.publish('SelectedProjectChanged', this.selectedProject), 100);
  }

  detached() {
    this.projectRemoved.dispose();
    this.projectAdded.dispose();
  }
}
