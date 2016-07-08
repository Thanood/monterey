import * as moment              from  'moment';
import {autoinject, observable} from 'aurelia-framework';
import {TaskManager}            from '../../shared/task-manager';
import {DialogController}       from 'aurelia-dialog';

@autoinject()
export class TaskManagerModal {
  @observable selectedTask;
  interval;
  model;
  filter = 'running';

  get tasks() {
    return this.filter === 'running' ? this.taskManager.runningTasks : this.taskManager.allTasks;
  }

  constructor(private dialogController: DialogController,
              private taskManager: TaskManager) {
  }

  activate(model) {
    this.model = model;
  }

  attached() {
    if (this.model.task) {
      this.selectedTask = this.model.task;
    } else if (this.taskManager.runningTasks.length > 0) {
      this.selectedTask = this.taskManager.runningTasks[0];
    }
    this.interval = setInterval(() => this.updateElapsed(), 1000);
  }

  selectedTaskChanged() {
    this.updateElapsed();
  }

  updateElapsed() {
    if (this.selectedTask && !this.selectedTask.finished) {
      let endDate;
      if (this.selectedTask.end) {
        endDate = this.selectedTask.end;
      } else {
        endDate = new Date();
      }
      this.selectedTask.elapsed = `${moment(endDate).diff(this.selectedTask.start, 'seconds')} seconds`;
    }
  }

  detached() {
    clearInterval(this.interval);
  }
}
