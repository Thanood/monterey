import {autoinject}  from 'aurelia-framework';
import {NPM, FS}     from 'monterey-pal';
import {TaskManager} from '../../task-manager/task-manager';
import {Project}     from '../../shared/project';
import {Task}        from '../../task-manager/task';

@autoinject()
export class Common {

  constructor(private taskManager: TaskManager) {
  }

  installNPMDependencies(project: Project, deps = [], estimation = 'This could take minutes to complete') {
    let task = <Task>{
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
        // npm outputs many messages, too many to show
        // so we remove any other silly/verbose/info/http messages before adding a new one
        let clearLevels = ['silly', 'verbose', 'info', 'http'];
        if (clearLevels.indexOf(message.level) > -1) {
          let toRemove = task.logs.filter(x => clearLevels.indexOf(x.level) > -1);
          for (let i = 0; i < toRemove.length; i++) {
            let index = task.logs.indexOf(toRemove[i]);
            task.logs.splice(index, 1);
          }
        }
        this.taskManager.addTaskLog(task, message.message, message.level);
      }
    });

    task.promise = promise;

    this.taskManager.addTask(task);

    return task;
  }
}
