import {autoinject}       from 'aurelia-framework';
import {JSPM, FS}         from 'monterey-pal';
import {DialogService}    from 'aurelia-dialog';
import {TaskManager}      from '../../shared/task-manager';
import {TaskManagerModal} from '../../main/components/task-manager-modal';

@autoinject()
export class Screen {

  lock = false;
  model;
  project;

  constructor(private taskManager: TaskManager,
              private dialogService: DialogService) {
  }

  activate(model) {
    this.model = model;
    this.project = model.selectedProject;
  }

  install() {
    let task = <any>{
      title: `jspm install of '${this.project.name}'`,
      estimation: 'This usually takes about a minute to complete',
      logs: []
    };

    let workingDirectory = FS.getFolderPath(this.project.packageJSONPath);

    let promise = JSPM.install([], {
      jspmOptions: {
        workingDirectory: workingDirectory,
        lock: this.lock
      },
      logCallback: (message) => {
        this.taskManager.addTaskLog(task, message.message);
      }
    })
    .then(() => JSPM.downloadLoader({
      jspmOptions: {
        workingDirectory: workingDirectory
      },
      logCallback: (message) => {
        this.taskManager.addTaskLog(task, message.message);
      }
    }));

    task.promise = promise;

    this.taskManager.addTask(task);

    this.dialogService.open({ viewModel: TaskManagerModal, model: { task: task }});
  }
}
