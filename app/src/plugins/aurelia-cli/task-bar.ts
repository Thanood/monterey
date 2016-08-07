import {TaskRunner}                    from '../task-runner/task-runner';
import {Project}                       from '../../shared/project';
import {autoinject}                    from 'aurelia-framework';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {Main}                          from '../../main/main';

@autoinject()
export class TaskBar {
  visible: boolean = false;
  toolbarVisible: boolean = false;
  subscription: Subscription;

  constructor(private ea: EventAggregator,
              private main: Main) {
    this.updateVisibility(main.selectedProject);

    this.subscription = this.ea.subscribe('SelectedProjectChanged', (project: Project) => {
      this.updateVisibility(project);
    });
  }

  updateVisibility(project: Project) {
    if (!project) {
      this.toolbarVisible = false;
      this.visible = false;
      return;
    }

    this.toolbarVisible = project.isUsingAureliaCLI();

    // close gulp window automatically if the currently selected project is not an aureia-cli project
    if (this.visible && !project.isUsingAureliaCLI()) {
      this.visible = false;
    }
  }

  toggle() {
    this.visible = !this.visible;
  }

  detached() {
    this.subscription.dispose();
  }
}