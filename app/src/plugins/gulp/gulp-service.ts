import {OS, FS} from 'monterey-pal';
import {Project, ProjectTask} from '../../shared/project';

export class GulpService {
  title  = 'Gulp';

  async getTasks(project: Project): Promise<Array<ProjectTask>> {
    let gulpFileDir = FS.getFolderPath(project.gulpfile);
    let output = await OS.exec('gulp --tasks-simple', { cwd:  gulpFileDir });

    let tasks = output.match(/[^\r\n]+/g);
    let commands: Array<ProjectTask> = [];

    tasks.forEach(task => {
      commands.push({ command: 'gulp', parameters: [task] });
    });

    return commands;
  }

  runTask(project: Project, task: ProjectTask, stdout, stderr) {
    let gulpFileDir = FS.getFolderPath(project.gulpfile);
    let result = OS.spawn(OS.getPlatform() === 'win32' ? 'gulp.cmd' : 'gulp', task.parameters, { cwd:  gulpFileDir }, out => stdout(out), err => stderr(err));
    return result;
  }

  cancelTask(process) {
    OS.kill(process);
  }

  getTaskBarTitle(runningTasks: number) {
    return runningTasks > 0 ? `Gulp (${runningTasks})` : 'Gulp';
  }
}