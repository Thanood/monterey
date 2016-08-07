import {autoinject}           from 'aurelia-framework';
import {OS, FS}               from 'monterey-pal';
import {ApplicationState}     from '../../shared/application-state';
import {Project, ProjectTask} from '../../shared/project';
import {TaskRunnerService} from '../task-runner/task-runner';

@autoinject()
export class GulpService implements TaskRunnerService {
  title  = 'Gulp';

  constructor(private state: ApplicationState) {}

  async getTasks(project: Project, useCache: boolean = true): Promise<Array<ProjectTask>> {
    let tasks;
    if (useCache && project.gulptasks) {
      tasks = project.gulptasks;
    } else {
      let gulpFileDir = FS.getFolderPath(project.gulpfile);
      let output = await OS.exec('gulp --tasks-simple', { cwd:  gulpFileDir });

      tasks = output.match(/[^\r\n]+/g);
      project.gulptasks = tasks;

      await this.state._save();
    }

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

  getTaskBarStyle(runningTasks: number) {
    return {
      title: runningTasks > 0 ? `Gulp (${runningTasks})` : 'Gulp',
      img: 'images/gulp-25x25.png'
    };
  }
}