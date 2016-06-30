import {inject}           from 'aurelia-framework';
import {TaskManager}      from '../../shared/task-manager';
import {withModal}        from '../../shared/decorators';
import {TaskManagerModal} from './task-manager-modal';

@inject(TaskManager)
export class TaskBar {
  get visible() {
    return this.taskManager.runningTasks.length > 0;
  }

  constructor(taskManager) {
    this.taskManager = taskManager;
  }

  @withModal(TaskManagerModal)
  showTasks() {}
}
