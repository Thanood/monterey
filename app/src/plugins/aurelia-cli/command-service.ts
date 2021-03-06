import {OS, FS, Project} from '../../shared/index';
import {CommandRunnerService, Task, Command} from '../task-manager/index';

export class CommandService implements CommandRunnerService {
  title = 'Aurelia-CLI';

  async getCommands(project: Project, useCache: boolean): Promise<Array<Command>> {
    return [
      new Command('au', ['run', '--watch']),
      new Command('au', ['run'])
    ];
  }

  handle(project: Project, command: Command) {
    return command.command === 'au';
  }

  runCommand(project: Project, command: Command, task: Task, stdout, stderr) {
    // Application Available At: http://localhost:9000
    let cmd = OS.getPlatform() === 'win32' ? `${command.command}.cmd` : command.command;

    let result = OS.spawn(cmd, command.args, { cwd:  project.path }, out => {
      this.tryGetPort(project, out, task);
      stdout(out);
    }, err => {
      this.warnENOENT(err, task);
      stderr(err, task);
    });
    return result;
  }

  warnENOENT(text: string, task: Task) {
    if (text.match(/ENOENT/)) {
      task.addTaskLog('ENOENT: Please install aurelia-cli: npm install aurelia-cli -g');
    }
  }

  // parse the output, try and find what url the project is running under
  tryGetPort(project: Project, text: string, task: Task) {
    let matches = text.match(/Application Available At: (.*)/);
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