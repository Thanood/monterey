import {OS, FS}               from 'monterey-pal';
import {Project, ProjectTask} from '../../shared/project';
import {Task}                 from '../task-manager/task';
import {TaskRunnerService}    from '../../shared/task-runner-service';

export class WebpackService implements TaskRunnerService {
  title  = 'Webpack';

  async getTasks(project: Project, useCache: boolean): Promise<Array<ProjectTask>> {
    return [
      { command: 'npm', parameters: ['start'] }
    ];
  }

  runTask(project: Project, projectTask: ProjectTask, task: Task, stdout, stderr) {
    let cmd = OS.getPlatform() === 'win32' ? `${projectTask.command}.cmd` : projectTask.command;
    let result = OS.spawn(cmd, projectTask.parameters, { cwd:  project.path }, out => {
      this.tryGetPort(project, out, task);
      stdout(out);
    }, err => stderr(err));
    return result;
  }

  // parse the output, try and find what url the project is running under
  tryGetPort(project: Project, text: string, task: Task) {
    let matches = text.match(/http:\/\/([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/);
    if (matches && matches.length > 0) {
      project.__meta__.url = matches[0];
      task.estimation = null;
      task.description = `Project running at <a href="${project.__meta__.url}" target="_blank">${project.__meta__.url}</a>`;
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