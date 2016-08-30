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
      let duration = moment.duration(moment(endDate).diff(this.task.start));
      let parts = [];
      let hours = duration.hours();
      let minutes = duration.minutes();
      let seconds = duration.seconds();
      if (hours > 0) {
        parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
      } 
      
      if (minutes > 0) {
        parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
      } 
      
      if (seconds > 0) {
        parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);
      }
      this.task.elapsed = parts.join(', ');
    }
  }

  stopTask(task: Task) {
    this.taskManager.stopTask(task);
  }

  detached() {
    clearInterval(this.interval);
  }
}