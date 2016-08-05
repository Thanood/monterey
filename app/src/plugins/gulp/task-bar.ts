import {TaskRunner}                    from './task-runner';
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
    this.toolbarVisible = main.selectedProject.isUsingGulp;

    this.subscription = this.ea.subscribe('SelectedProjectChanged', (project: Project) => {
      this.toolbarVisible = project.isUsingGulp;

      // close gulp window automatically if the currently selected project does not use gulp
      if (this.visible && !project.isUsingGulp) {
        this.visible = false;
      }
    });
  }

  toggle() {
    this.visible = !this.visible;
  }

  detached() {
    this.subscription.dispose();
  }
}