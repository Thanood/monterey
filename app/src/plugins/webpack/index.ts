import {autoinject}       from 'aurelia-framework';
import {PluginManager}    from '../../shared/plugin-manager';
import {Detection}        from './detection';
import {BasePlugin}       from '../base-plugin';
import {Project}          from '../../shared/project';
import {Task}             from '../task-manager/task';
import {CommandRunner}    from '../task-manager/command-runner';

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

@autoinject()
export class Plugin extends BasePlugin {
  constructor(private detection: Detection,
              private commandRunner: CommandRunner) {
    super();
  }

  getTiles(project: Project, showIrrelevant) {
    if (!showIrrelevant && !project.isUsingWebpack()) {
      return [];
    }

    return [{
      name: 'webpack',
      model: { relevant: !!project.isUsingWebpack() },
      viewModel: 'plugins/webpack/tile'
    }];
  }

  async evaluateProject(project: Project) {
    await this.detection.findWebpackConfig(project);
  }

  async getProjectInfoSections(project: Project) {
    if (project.isUsingWebpack()) {
      return [{ viewModel: 'plugins/webpack/project-info' }];
    }
    return [];
  }

  async getPostInstallTasks(project: Project): Promise<Array<Task>> {
    if (!project.isUsingWebpack()) return;
    
    let tasks = [];

    tasks.push(new Task(project, 'Loading project tasks', () => this.commandRunner.load(project, false)));

    tasks.push(this.commandRunner.runByCmd(project, 'npm start'));

    return tasks;
  }
}