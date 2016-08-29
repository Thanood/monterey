import {autoinject}           from 'aurelia-framework';
import {CommandRunnerService} from './command-runner-service';
import {TaskManager}          from './task-manager';
import {Task}                 from './task';
import {Command}              from './command';
import {Project}              from '../../shared/project';
import {PluginManager}        from '../../shared/plugin-manager';

/**
 * The CommandRunner creates a Task from a Command ('gulp watch')
 */
@autoinject()
export class CommandRunner {
  constructor(private taskManager: TaskManager, 
              private pluginManager: PluginManager) {}

  run(project: Project, command: Command) {
    let task = new Task(project, `${command.command} ${command.args.join(' ')}`);
    
    task.execute = this._executor(task, project, command);
    task.stoppable = true;
    task.stop = this._stop(task);

    return task;
  }

  _stop(task: Task) {
    return () => {
      let service = <CommandRunnerService>(task.meta.service);
      return service.stopCommand(task.meta.process) 
    };
  }

  _executor(task: Task, project: Project, command: Command) {
    return () => {
      let result = command.service.runCommand(project, command, task, stdout => {
        this.taskManager.addTaskLog(task, stdout);
      }, stderr => {
        this.taskManager.addTaskLog(task, stderr);
      });
      
      task.meta = {
        service: command.service,
        process: result.process
      };

      return result.completion;
    };
  }

  async getCommands(project: Project, withCache: boolean = true): Promise<Array<Command>> {
    let services = await this.getServices(project);
    let commands = [];

    for (let x = 0; x < services.length; x++) {
      commands = commands.concat(await services[x].getCommands(project, withCache));
    }
    
    return commands;
  }

  async getServices(project: Project) {
    let services = await this.pluginManager.getCommandServices(project);
    return services;
  }

  runByCmd(project: Project, cmd: string) {
    let task = new Task(project, cmd);
    
    task.execute = async () => {
      let commands = await this.getCommands(project, true);
      let foundCommand;
      commands.forEach(command => {
        if (`${command.command} ${command.args.join(' ')}` === cmd) {
          foundCommand = command;
        }
      });

      if (!foundCommand) {
        throw new Error(`did not find command ${cmd}`);
      }

      return this._executor(task, project, foundCommand)();
    };
    task.stoppable = true;
    task.stop = this._stop(task);

    return task;
  }
}