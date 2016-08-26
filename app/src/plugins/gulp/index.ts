import {autoinject}    from 'aurelia-framework';
import {PluginManager} from '../../shared/plugin-manager';
import {BasePlugin}    from '../base-plugin';
import {Detection}     from './detection';
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
    if (!showIrrelevant && !project.isUsingGulp()) {
      return [];
    }

    return [{
      name: 'gulp',
      model: { relevant: project.isUsingGulp() },
      viewModel: 'plugins/gulp/tile'
    }];
  }

  async evaluateProject(project: Project) {
    await this.detection.findGulpConfig(project);
  }

  async getProjectInfoSections(project: Project) {
    if (project.isUsingGulp()) {
      return [{ viewModel: 'plugins/gulp/project-info' }];
    }
    return [];
  }

  async getPostInstallTasks(project: Project): Promise<Array<Task>> {
    if (!project.isUsingGulp()) return;
    
    let tasks = [];

    tasks.push(new Task(project, 'Loading project tasks', () => this.commandRunner.load(project, false)));

    tasks.push(this.commandRunner.runByCmd(project, 'gulp watch'));

    return tasks;
  }
}