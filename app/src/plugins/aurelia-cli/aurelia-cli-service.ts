import {OS, FS}               from 'monterey-pal';
import {Project, ProjectTask} from '../../shared/project';
import {TaskRunnerService}    from '../../shared/task-runner-service';

export class AureliaCLIService implements TaskRunnerService {
  title  = 'Aurelia-CLI';

  async getTasks(project: Project, useCache: boolean): Promise<Array<ProjectTask>> {
    return [
      { command: 'au', parameters: ['run', '--watch'] },
      { command: 'au', parameters: ['run'] }
    ];
  }

  runTask(project: Project, task: ProjectTask, stdout, stderr) {
    // Application Available At: http://localhost:9000
    let cmd = OS.getPlatform() === 'win32' ? `${task.command}.cmd` : task.command;

    let result = OS.spawn(cmd, task.parameters, { cwd:  project.path }, out => {
      this.tryGetPort(project, out);
      stdout(out);
    }, err => stderr(err));
    return result;
  }

  // parse the output, try and find what url the project is running under
  tryGetPort(project: Project, text: string) {
    let matches = text.match(/Application Available At: (.*)/);
    if (matches && matches.length === 2) {
      project.__meta__.url = matches[1];
    }
  }

  cancelTask(process) {
    return OS.kill(process);
  }

  getTaskBarStyle(runningTasks: number) {
    return {
      title: runningTasks > 0 ? `Aurelia-CLI (${runningTasks})` : 'Aurelia-CLI',
      img: 'images/aurelia-25x25.png'
    };
  }
}