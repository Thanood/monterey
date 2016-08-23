import {autoinject, bindable} from 'aurelia-framework';
import {withModal}        from '../../shared/decorators';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {TaskManager}      from './task-manager';
import {TaskManagerModal} from './task-manager-modal';

@autoinject()
export class TaskBar {
  subscriptions: Array<Subscription> = [];

  @withModal(TaskManagerModal)
  showTasks() {}

  @bindable running: number = 0;
  @bindable queued: number = 0;
  busy: boolean;
  taskManagerText: string = 'Task Manager';

  constructor(private ea: EventAggregator) {}

  attached() {
    this.subscriptions.push(this.ea.subscribe('TaskStarted', () => {
      this.queued --; this.running ++;
     }));
    this.subscriptions.push(this.ea.subscribe('TaskAdded', () => this.queued ++));
    this.subscriptions.push(this.ea.subscribe('TaskFinished', () => this.running --));
  }

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