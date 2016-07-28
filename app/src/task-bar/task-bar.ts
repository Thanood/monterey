import {autoinject}       from 'aurelia-framework';
import {TaskManager}      from '../task-manager/task-manager';
import {withModal}        from '../shared/decorators';
import {TaskManagerModal} from '../task-manager/task-manager-modal';
import {Main}             from '../main/main';
import {Errors}           from '../errors/errors';
import {ErrorModal}       from '../errors/error-modal';

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
              private errors: Errors,
              private main: Main) {
  }

  @withModal(TaskManagerModal)
  showTasks() {}

  @withModal(ErrorModal)
  showErrors() {}

  openSupportPage() {
    window.open('https://github.com/monterey-framework/monterey/issues', '_blank');
  }

  openPreferences() {
    this.main.activateScreen('plugins/preferences/screen');
  }
}
