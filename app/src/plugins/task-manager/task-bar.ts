import {autoinject, bindable}          from 'aurelia-framework';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {withModal}        from '../../shared/decorators';
import {SelectedProject}  from '../../shared/selected-project';
import {TaskManager}      from './task-manager';
import {TaskManagerModal} from './task-manager-modal';

@autoinject()
export class TaskBar {
  subscriptions: Array<Subscription> = [];

  @bindable running: number = 0;
  @bindable queued: number = 0;
  busy: boolean;
  taskManagerText: string = 'Task Manager';

  constructor(private ea: EventAggregator,
              private taskManager: TaskManager,
              private selectedProject: SelectedProject) {}

  attached() {
    this.running = this.taskManager.tasks.filter(x => x.status === 'running').length;
    this.queued = this.taskManager.tasks.filter(x => x.status === 'queued').length;

    this.subscriptions.push(this.ea.subscribe('TaskStarted', () => {
      this.queued --; this.running ++;
     }));
    this.subscriptions.push(this.ea.subscribe('TaskAdded', () => this.queued ++));
    this.subscriptions.push(this.ea.subscribe('TaskFinished', () => this.running --));
  }

  @withModal(TaskManagerModal, function () { return { project: this.selectedProject.current }; })
  showTasks() {}

  propertyChanged() {
    let text = 'Task manager';
    if (this.running > 0 && this.queued == 0) {
      text = `${text} (${this.running} running)`;
    } else if (this.queued > 0 && this.running === 0) {
      text = `${text} (${this.queued} queued)`;
    } else if(this.queued > 0 && this.running > 0) {
      text = `${text} (${this.running} running, ${this.queued} queued)`;
    }

    if (this.running > 0 || this.queued > 0) {
      this.busy = true;
    } else {
      this.busy = false;
    }

    this.taskManagerText = text;
  }

  detached() {
    this.subscriptions.forEach(subscription => subscription.dispose());
  }
}