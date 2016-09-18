import {CommandRunnerService} from './command-runner-service';
import {CommandRunnerLocator} from './command-runner-locator';
import {Command}              from './command';
import {TaskManager}          from '../task-manager';
import {Task}                 from '../task';
import {PluginManager, Project, autoinject} from '../../../shared/index';

/**
 * The CommandRunner creates a Task from a Command ('gulp watch')
 */
@autoinject()
export class CommandRunner {
  constructor(private taskManager: TaskManager,
              private serviceLocator: CommandRunnerLocator,
              private pluginManager: PluginManager) {}

  run(project: Project, command: Command) {
    let service = this.serviceLocator.getHandler(project, command);
    let task = new Task(project, command.displayName);

    task.execute = this._executor(task, service, project, command);
    task.stoppable = true;
    task.stop = this._stop(service, task);

    return task;
  }

  _stop(service: CommandRunnerService, task: Task) {
    return () => {
      return service.stopCommand(task.meta.process);
    };
  }

  _executor(task: Task, service: CommandRunnerService, project: Project, command: Command) {
    return () => {
      let result = service.runCommand(project, command, task, stdout => {
        this.taskManager.addTaskLog(task, stdout);
      }, stderr => {
        this.taskManager.addTaskLog(task, stderr);
      });

      task.meta.process = result.process;

      return result.completion;
    };
  }

  async getServices(project: Project) {
    let services = await this.pluginManager.getCommandServices(project);
    return services;
  }
}