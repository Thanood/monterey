import {autoinject}                           from 'aurelia-framework';
import {CommandRunnerService, ServiceLocator} from './command-runner-service';
import {TaskManager}                          from './task-manager';
import {Task}                                 from './task';
import {Command}                              from './command';
import {Project}                              from '../../shared/project';

@autoinject()
export class CommandRunner {
  constructor(private locator: ServiceLocator,
              private taskManager: TaskManager) {}
  run(project: Project, command: Command) {
    let service = this.locator.get(project);
    let task = new Task(project, `${command.command} ${command.parameters.join(' ')}`);
    
    task.execute = this._executor(service, task, project, command);
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

  _executor(service: CommandRunnerService, task: Task, project: Project, command: Command) {
    return () => {
      let result = service.runCommand(project, command, task, stdout => {
        this.taskManager.addTaskLog(task, stdout);
      }, stderr => {
        this.taskManager.addTaskLog(task, stderr);
      });
      
      task.meta = {
        service: service,
        process: result.process
      };

      return result.completion;
    };
  }

  async load(project: Project, withCache: boolean = true) {
    let service = <CommandRunnerService>this.locator.get(project);
    if (service) {
      return await service.getCommands(project, withCache);
    } else {
      return [];
    }
  }

  runByCmd(project: Project, cmd: string) {
    let service = <CommandRunnerService>this.locator.get(project);
    let task = new Task(project, cmd);
    
    task.execute = async () => {
      let commands = await this.load(project, true);
      let foundCommand;
      commands.forEach(command => {
        if (`${command.command} ${command.parameters.join(' ')}` === cmd) {
          foundCommand = command;
        }
      });

      return this._executor(service, task, project, foundCommand)();
    };
    task.stoppable = true;
    task.stop = this._stop(task);

    return task;
  }
}