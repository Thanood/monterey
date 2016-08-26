import {NPM, FS}     from 'monterey-pal';
import {Task}        from '../../plugins/task-manager/task';
import {Project}     from '../../shared/project';

export class Common {
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
          task.addTaskLog(message.message, message.level);
        }
      });

      return promise;
    };

    return task;
  }
}
