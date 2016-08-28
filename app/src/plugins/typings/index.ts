import {autoinject}    from 'aurelia-framework';
import {BasePlugin}    from '../base-plugin';
import {Detection}     from './detection';
import {PluginManager} from '../../shared/plugin-manager';
import {Project}       from '../../shared/project';
import {Task}          from '../task-manager/task';
import {CommandRunner} from '../task-manager/command-runner';

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
    if (!showIrrelevant && !project.isUsingTypings()) {
      return [];
    }

    return [{
      name: 'typings',
      model: { relevant: project.isUsingTypings() },
      viewModel: 'plugins/typings/tile'
    }];
  }

  async evaluateProject(project: Project) {
    await this.detection.findTypingsJSONFile(project);
  }

  async getProjectInfoSections(project: Project) {
    if (project.isUsingTypings()) {
      return [{ viewModel: 'plugins/typings/project-info' }];
    }
    return [];
  }

  async getPostInstallTasks(project: Project): Promise<Array<Task>> {
    if (!project.isUsingTypings()) return;
    
    let tasks = [];

    tasks.push(new Task(project).fromPostInstallProcess({
      description: 'Installing Typings',
      command: 'node',
      args: ['node_modules/typings/dist/bin.js', 'install']
    }));

    return tasks;
  }
}