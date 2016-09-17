import {OS, FS}               from 'monterey-pal';
import {CommandRunnerService} from '../task-manager/command-runner-service';
import {Task}                 from '../task-manager/task';
import {Command}              from '../task-manager/command';
import {Project}              from '../../shared/index';

export class CommandService implements CommandRunnerService {
  title = 'DotNet';

  async getCommands(project: Project, useCache: boolean): Promise<Array<Command>> {
    return [
      { command: 'dotnet', args: ['restore'], service: this },
      { command: 'dotnet', args: ['run'], service: this }
    ];
  }

  handle(project: Project, command: Command) {
    return command.command === 'dotnet' && project.isUsingDotnetCore();
  }

  runCommand(project: Project, command: Command, task: Task, stdout, stderr) {
    let projJSONdir = FS.getFolderPath(project.projectJSONPath);
    let result = OS.spawn(command.command, command.args, { cwd:  projJSONdir }, out => {
      this.tryGetPort(project, out, task);
      stdout(out);
    }, err => stderr(err));
    return result;
  }

  // parse the output, try and find what url the project is running under
  tryGetPort(project: Project, text: string, task: Task) {
    let matches = text.match(/Now listening on: (.*)/);
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