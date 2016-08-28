import {LogManager, autoinject} from 'aurelia-framework';
import {Logger}        from 'aurelia-logging';
import {BasePlugin}    from '../base-plugin';
import {Detection}     from './detection';
import {PluginManager} from '../../shared/plugin-manager';
import {Project}       from '../../shared/project';
import {Notification}  from '../../shared/notification';
import {Errors}        from '../errors/errors';
import {Task}          from '../task-manager/task';
import {CommandRunner} from '../task-manager/command-runner';
import {OS, FS}        from 'monterey-pal';

const logger = <Logger>LogManager.getLogger('dotnet plugin');

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

@autoinject()
export class Plugin extends BasePlugin {
  constructor(private detection: Detection,
              private commandRunner: CommandRunner,
              private notification: Notification,
              private errors: Errors) {
    super();
  }

  getTiles(project: Project, showIrrelevant) {
    if (!showIrrelevant && !project.isUsingDotnetCore()) {
      return [];
    }

    return [{
      name: 'dotnet',
      model: { relevant: project.isUsingDotnetCore() },
      viewModel: 'plugins/dotnet/tile'
    }];
  }

  async evaluateProject(project: Project) {
    await this.detection.detect(project);
  }

  async getProjectInfoSections(project: Project) {
    if (project.isUsingDotnetCore()) {
      return [{ viewModel: 'plugins/dotnet/project-info' }];
    }
    return [];
  }

  async getPostInstallTasks(project: Project): Promise<Array<Task>> {
    if (!project.isUsingDotnetCore()) return;
    
    let tasks = [];

    let cwd = project.packageJSONPath ? FS.getFolderPath(project.packageJSONPath) : project.path;
    try {
      // making sure that dotnet is installed
      await OS.exec('dotnet --help', { cwd: cwd });

      tasks.push(new Task(project).fromPostInstallProcess({
        description: 'dotnet restore',
        command: 'dotnet',
        args: ['restore']
      }));
    } catch(err) {
      this.notification.error('Error during "dotnet --help", did you install dotnet core?');
      logger.error(err);
      this.errors.add(err);
    }

    return tasks;
  }
}