import {inject}      from 'aurelia-framework';
import {NPM, FS}     from 'monterey-pal';
import {TaskManager} from '../../shared/task-manager';

@inject(TaskManager)
export class Screen {

  _installing = false;

  constructor(taskManager) {
    this.taskManager = taskManager;
  }

  activate(model) {
    this.model = model;
    this.project = model.selectedProject;
    console.log(this.project.packageJSONPath);
  }

  install() {
    if (this._installing) {
      alert('Already installing');
      return;
    }

    this._installing = true;

    let task = {
      title: `npm install of '${this.project.name}'`,
      estimation: 'This could take minutes to complete',
      logs: []
    };

    let promise = NPM.install([], {
      npmOptions: {
        workingDirectory: FS.getFolderPath(this.project.packageJSONPath)
      },
      logCallback: (message) => {
        if (message.level === 'custom' || message.level === 'warning' || message.level === 'error') {
          this.taskManager.addTaskLog(task, message.message);
        }
      }
    })
    .then(() => this._installing = false);

    task.promise = promise;

    this.taskManager.addTask(task);
  }
}
