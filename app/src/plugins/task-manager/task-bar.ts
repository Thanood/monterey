import {autoinject}       from 'aurelia-framework';
import {withModal}        from '../../shared/decorators';
import {TaskManager}      from '../../task-manager/task-manager';
import {TaskManagerModal} from '../../task-manager/task-manager-modal';

@autoinject()
export class TaskBar {
  get visible() {
    return this.taskManager.runningTasks.length > 0;
  }

  get taskManagerText () {
    if (this.taskManager.runningTasks.length > 0) {
      return `busy with ${this.taskManager.runningTasks.length} tasks...`;
    } else {
      return 'Taskmanager';
    }
  }

  constructor(private taskManager: TaskManager) { console.log(taskManager); }

  @withModal(TaskManagerModal)
  showTasks() {}

}