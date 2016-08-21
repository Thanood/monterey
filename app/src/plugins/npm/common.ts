import {autoinject}  from 'aurelia-framework';
import {NPM, FS}     from 'monterey-pal';
import {TaskManager} from '../../plugins/task-manager/task-manager';
import {Task}        from '../../plugins/task-manager/task';
import {Project}     from '../../shared/project';

@autoinject()
export class Common {

  constructor(private taskManager: TaskManager) {
  }

  installNPMDependencies(project: Project, deps = [], estimation = 'This could take minutes to complete') {
    let task = new Task(project, 'NPM install');
    task.estimation = estimation;
    task.execute = () => {
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

      return promise;
    };

    this.taskManager.addTask(project, task);

    return task;
  }
}
