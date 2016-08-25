import {autoinject, Container}               from 'aurelia-framework';
import {Project}                             from '../../shared/project';
import {Task}                                from '../task-manager/task';
import {CommandService as GulpService}       from '../gulp/command-service';
import {CommandService as WebpackService}    from '../webpack/command-service';
import {CommandService as AureliaCLIService} from '../aurelia-cli/command-service';
import {Command}                             from './command';

export interface CommandRunnerService {
  stopCommand(process): Promise<void>;
  runCommand(project: Project, command: Command, task: Task, stdout, stderr);
  getCommands(project: Project, useCache: boolean): Promise<Array<Command>>;
}

@autoinject()
export class ServiceLocator {
  constructor(private container: Container) {}

  get(project: Project) {
    if (project.isUsingGulp()) {
      return this.container.get(GulpService);
    } else if (project.isUsingAureliaCLI()) {
      return this.container.get(AureliaCLIService);
    } else if (project.isUsingWebpack()) {
      return this.container.get(WebpackService);
    }
  }
}