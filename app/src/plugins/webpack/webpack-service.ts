import {OS, FS}               from 'monterey-pal';
import {Project, ProjectTask} from '../../shared/project';
import {TaskRunnerService}    from '../../shared/task-runner-service';

export class WebpackService implements TaskRunnerService {
  title  = 'Webpack';

  async getTasks(project: Project, useCache: boolean): Promise<Array<ProjectTask>> {
    return [
      { command: 'npm', parameters: ['start'] }
    ];
  }

  runTask(project: Project, task: ProjectTask, stdout, stderr) {
    let cmd = OS.getPlatform() === 'win32' ? `${task.command}.cmd` : task.command;
    let result = OS.spawn(cmd, task.parameters, { cwd:  project.path }, out => {
      this.tryGetPort(project, out);
      stdout(out);
    }, err => stderr(err));
    return result;
  }

  // parse the output, try and find what url the project is running under
  tryGetPort(project: Project, text: string) {
    let matches = text.match(/http:\/\/([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/);
    if (matches && matches.length > 0) {
      project.__meta__.url = matches[0];
    }
  }

  stopTask(process) {
    return OS.kill(process);
  }

  getTaskBarStyle(runningTasks: number) {
    return {
      title: runningTasks > 0 ? `Webpack (${runningTasks})` : 'Webpack',
      img: 'images/webpack-25x25.png'
    };
  }
}