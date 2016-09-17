import {Task} from '../../plugins/task-manager/index';
import {Project, OS, FS}from '../../shared/index';

export class Common {
  installNPMDependencies(project: Project, deps = [], estimation = 'This takes minutes to complete') {
    let task = new Task(project, 'NPM install');
    task.estimation = estimation;
    task.execute = () => {
      let args = ['install'].concat(deps);
      let cwd = FS.getFolderPath(project.packageJSONPath);
      let promise = OS.spawn(OS.getPlatform() === 'win32' ? 'npm.cmd' : 'npm', args, { cwd: cwd }, out => {
        task.addTaskLog(out);
      }, err => {
        task.addTaskLog(err);
      });

      task.meta = { process: promise.process };

      return promise.completion;
    };

    task.stoppable = true;
    task.stop = async () => {
      return OS.kill(task.meta.process);
    };

    return task;
  }
}
