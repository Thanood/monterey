import {OS, FS}               from 'monterey-pal';
import {Project}              from '../../shared/project';
import {Task}                 from '../task-manager/task';
import {CommandRunnerService} from '../task-manager/command-runner-service';
import {Command}              from '../task-manager/command';

export class CommandService implements CommandRunnerService {
  title = 'Webpack';

  async getCommands(project: Project, useCache: boolean): Promise<Array<Command>> {
    return [
      { command: 'npm', args: ['start'], service: this }
    ];
  }

  handle(project: Project, command: Command) {
    // this service handles only the execution of the npm start command
    return command.command === 'npm' && (command.args.length === 1 && command.args[0] === 'start');
  }

  runCommand(project: Project, command: Command, task: Task, stdout, stderr) {
    let cmd = OS.getPlatform() === 'win32' ? `${command.command}.cmd` : command.command;
    let result = OS.spawn(cmd, command.args, { cwd:  project.path }, out => {
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

  stopCommand(process) {
    return OS.kill(process);
  }
}