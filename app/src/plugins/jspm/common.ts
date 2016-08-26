import {JSPM, FS}         from 'monterey-pal';
import {Task}             from '../../plugins/task-manager/task';
import {Project}          from '../../shared/project';

export class Common {

  install(project: Project, deps, jspmOptions = null, withLoader = false) {

    let workingDirectory = FS.getFolderPath(project.packageJSONPath);

    // always supply a workingDirectory so that
    // we're not jspm installing in monterey directory
    Object.assign(jspmOptions, {
      workingDirectory: workingDirectory
    });

    let task = new Task(project, 'JSPM install');
    task.estimation = 'This usually takes about a minute to complete';

    task.execute = () => {
      let promise = JSPM.install(deps, {
        project: project,
        jspmOptions: jspmOptions,
        logCallback: (message) => {
          task.addTaskLog(message.message);
        }
      });

      if (withLoader) {
        promise = promise.then(() => this.downloadLoader(project, (message) => {
          task.addTaskLog(message.message);
        }));
      }

      return promise;
    }

    return task;
  }

  downloadLoader(project: Project, callback) {
    let workingDirectory = FS.getFolderPath(project.packageJSONPath);

    return JSPM.downloadLoader({
      project: project,
      jspmOptions: {
        workingDirectory: workingDirectory
      },
      logCallback: callback
    });
  }
}