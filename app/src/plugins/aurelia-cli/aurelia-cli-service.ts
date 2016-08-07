import {OS, FS} from 'monterey-pal';
import {Project, ProjectTask} from '../../shared/project';

export class AureliaCLIService {
  title  = 'Aurelia-CLI';

  async getTasks(project: Project): Promise<Array<ProjectTask>> {
    return [
      { command: 'au', parameters: ['run', '--watch'] },
      { command: 'au', parameters: ['run'] }
    ];
  }

  runTask(project: Project, task: ProjectTask, stdout, stderr) {
    let result = OS.spawn(OS.getPlatform() === 'win32' ? `${task.command}.cmd` : task.command, task.parameters, { cwd:  project.path }, out => stdout(out), err => stderr(err));
    return result;
  }

  cancelTask(process) {
    OS.kill(process);
  }

  getTaskBarTitle(runningTasks: number) {
    return runningTasks > 0 ? `Aurelia-CLI (${runningTasks})` : 'Aurelia-CLI';
  }
}