import {Command}                      from './command';
import {CommandRunnerService}         from './command-runner-service';
import {CommandService as Default}    from './default-command-service';
import {CommandService as Gulp}       from '../gulp/command-service';
import {CommandService as DotNet}     from '../dotnet/command-service';
import {CommandService as AureliaCLI} from '../aurelia-cli/command-service';
import {CommandService as Webpack}    from '../webpack/command-service';
import {Project, autoinject, Container} from '../../shared/index';

@autoinject()
export class CommandRunnerLocator {
  services: Array<CommandRunnerService> = [];

  constructor(private container: Container) {
    this.register(Gulp);
    this.register(DotNet);
    this.register(AureliaCLI);
    this.register(Webpack);
    this.register(Default);
  }

  /**
   * Based on a Command, ask which CommandServices wants to handle the execution
   */
  getHandler(project: Project, command: Command) {
    for (let service of this.services) {
      if (service.handle(project, command)) {
        return service;
      }
    }
  }

  register(_class) {
    this.services.push(this.container.get(_class));
  }
}