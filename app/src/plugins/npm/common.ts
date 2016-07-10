import {autoinject}  from 'aurelia-framework';
import {NPM, FS}     from 'monterey-pal';
import {TaskManager} from '../../task-manager/task-manager';

@autoinject()
export class Common {

  constructor(private taskManager: TaskManager) {
  }

  installNPMDependencies(project, deps = [], estimation = 'This could take minutes to complete') {
    let task = {
      title: `npm install of '${project.name}'`,
      estimation: estimation,
      logs: [],
      promise: null
    };

    let promise = NPM.install(deps, {
      npmOptions: {
        workingDirectory: FS.getFolderPath(project.packageJSONPath)
      },
      logCallback: (message) => {
        if (message.level === 'custom' || message.level === 'warning' || message.level === 'error') {
          this.taskManager.addTaskLog(task, message.message);
        }
      }
    });

    task.promise = promise;

    this.taskManager.addTask(task);

    return task;
  }
}
