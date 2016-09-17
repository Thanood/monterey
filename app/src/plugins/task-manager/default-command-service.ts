import {OS, FS}               from 'monterey-pal';
import {Project}              from '../../shared/project';
import {CommandRunnerService} from '../task-manager/command-runner-service';
import {Task}                 from '../task-manager/task';
import {Command}              from '../task-manager/command';

export class CommandService implements CommandRunnerService {
  title = 'Generic';

  async getCommands(project: Project, useCache: boolean): Promise<Array<Command>> {
    return [];
  }

  /**
   * The generic command service will handle all commands that
   * other command services don't handle
   */
  handle(project: Project, command: Command) {
    return true;
  }

  runCommand(project: Project, command: Command, task: Task, stdout, stderr) {
    // Application Available At: http://localhost:9000
    let cmd = OS.getPlatform() === 'win32' ? `${command.command}` : command.command;

    let result = OS.spawn(cmd, command.args, { cwd:  project.path }, out => stdout(out), err => stderr(err));
    return result;
  }

  stopCommand(process) {
    return OS.kill(process);
  }
}