import {OS, FS} from 'monterey-pal';
import {Project, ProjectTask} from '../../shared/project';

export class WebpackService {
  title  = 'Webpack';

  async getTasks(project: Project, useCache: boolean): Promise<Array<ProjectTask>> {
    return [
      { command: 'npm', parameters: ['start'] }
    ];
  }

  runTask(project: Project, task: ProjectTask, stdout, stderr) {
    let result = OS.spawn(OS.getPlatform() === 'win32' ? `${task.command}.cmd` : task.command, task.parameters, { cwd:  project.path }, out => stdout(out), err => stderr(err));
    return result;
  }

  cancelTask(process) {
    OS.kill(process);
  }

  getTaskBarStyle(runningTasks: number) {
    return {
      title: runningTasks > 0 ? `Webpack (${runningTasks})` : 'Webpack',
      img: 'images/webpack-25x25.png'
    };
  }
}