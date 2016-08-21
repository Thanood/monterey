import {bindable, autoinject} from 'aurelia-framework';
import {Task} from './task';
import {TaskManager} from './task-manager';

@autoinject()
export class TaskDetail {
  @bindable task;
  interval: any;

  constructor(private taskManager: TaskManager) {
  }

  attached() {
    this.interval = setInterval(() => this.updateElapsed(), 1000);
    this.updateElapsed();
  }

  taskChanged() {
    this.updateElapsed();
  }

  updateElapsed() {
    if (this.task) {
      let endDate;
      if (this.task.end) {
        endDate = this.task.end;
      } else {
        endDate = new Date();
      }
      this.task.elapsed = `${moment(endDate).diff(this.task.start, 'seconds')} seconds`;
    }
  }

  cancelTask(task: Task) {
    this.taskManager.cancelTask(task);
  }

  detached() {
    clearInterval(this.interval);
  }
}