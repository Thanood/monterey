import {autoinject}  from 'aurelia-framework';
import {JSPM, FS}    from 'monterey-pal';
import {TaskManager} from '../../shared/task-manager';

@autoinject()
export class Screen {

  _installing = false;
  lock = false;
  model;
  project;

  constructor(private taskManager: TaskManager) {
  }

  activate(model) {
    this.model = model;
    this.project = model.selectedProject;
  }

  install() {
    if (this._installing) {
      alert('Already installing');
      return;
    }

    this._installing = true;

    let task = <any>{
      title: `jspm install of '${this.project.name}'`,
      estimation: 'This could take minutes to complete',
      logs: []
    };

    let promise = JSPM.install([], {
      jspmOptions: {
        workingDirectory: FS.getFolderPath(this.project.packageJSONPath),
        lock: this.lock
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
