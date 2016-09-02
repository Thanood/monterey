import {bindable, autoinject}          from 'aurelia-framework';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {Task}                          from './task';
import {TaskManager}                   from './task-manager';
import {Logger}                        from './components/logger';

@autoinject()
export class TaskDetail {
  @bindable task;
  logger: Logger;
  interval: any;
  subscription: Subscription;

  constructor(private taskManager: TaskManager,
              private ea: EventAggregator) {
    this.subscription = ea.subscribe('TaskFinished', (info) => {
      if (this.task && info.task === this.task) {
        this.taskFinished();
      }
    });
  }

  taskFinished() {
    // disable autoscroll as soon as the task finishes
    if (this.logger.autoScroll) {
      // but scroll down first, so the last message is visible
      this.logger.scrollDown();
      this.logger.autoScroll = false;
    }
  }

  attached() {
    this.interval = setInterval(() => this.updateElapsed(), 1000);
    this.updateElapsed();
  }

  taskChanged() {
    if (this.logger) {
      this.logger.autoScroll = !this.task.finished;
    }
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
    this.subscription.dispose();
    
    clearInterval(this.interval);
  }
}