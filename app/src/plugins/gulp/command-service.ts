import {autoinject}                from 'aurelia-framework';
import {OS, FS}                    from 'monterey-pal';
import {ApplicationState, Project} from '../../shared/index';
import {CommandRunnerService}      from '../task-manager/command-runner-service';
import {Task}                      from '../task-manager/task';
import {Command}                   from '../task-manager/command';

@autoinject()
export class CommandService implements CommandRunnerService {
  title = 'Gulp';

  constructor(private state: ApplicationState) {}

  async getCommands(project: Project, useCache: boolean = true): Promise<Array<Command>> {
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

    let commands: Array<Command> = [];

    tasks.forEach(task => {
      commands.push({ command: 'gulp', args: [task], service: this });
    });

    return commands;
  }

  handle(project: Project, command: Command) {
    return command.command === 'gulp';
  }

  runCommand(project: Project, command: Command, task: Task, stdout, stderr) {
    let gulpFileDir = FS.getFolderPath(project.gulpfile);
    let cmd = OS.getPlatform() === 'win32' ? 'gulp.cmd' : 'gulp';
    let result = OS.spawn(cmd, command.args, { cwd:  gulpFileDir }, out => {
      this.tryGetPort(project, out, task);
      stdout(out);
    }, err => stderr(err));
    return result;
  }

  // parse the output, try and find what url the project is running under
  tryGetPort(project: Project, text: string, task: Task) {
    let matches = text.match(/Local: (.*)\s/);
    if (matches && matches.length === 2) {
      project.__meta__.url = matches[1];
      task.estimation = null;
      task.description = `Project running at <a href="${project.__meta__.url}" target="_blank">${project.__meta__.url}</a>`;
    }
  }

  stopCommand(process) {
    return OS.kill(process);
  }
}