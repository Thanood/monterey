import {autoinject}       from 'aurelia-framework';
import {TaskManager}      from '../task-manager/task-manager';
import {withModal}        from '../shared/decorators';
import {TaskManagerModal} from '../task-manager/task-manager-modal';
import {Main}             from '../main/main';

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

  constructor(private taskManager: TaskManager,
              private main: Main) {
  }

  @withModal(TaskManagerModal)
  showTasks() {}

  openSupportPage() {
    window.open('https://github.com/monterey-framework/monterey/issues', '_blank');
  }

  openPreferences() {
    this.main.activateScreen('plugins/preferences/screen');
  }
}
