import {autoinject}       from 'aurelia-framework';
import {TaskManager}      from '../../shared/task-manager';
import {withModal}        from '../../shared/decorators';
import {TaskManagerModal} from './task-manager-modal';

@autoinject()
export class TaskBar {
  get visible() {
    return this.taskManager.runningTasks.length > 0;
  }

  constructor(private taskManager: TaskManager) {
  }

  @withModal(TaskManagerModal)
  showTasks() {}
}
