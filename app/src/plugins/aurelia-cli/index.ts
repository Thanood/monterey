import {autoinject, LogManager} from 'aurelia-framework';
import {Logger}                 from 'aurelia-logging';
import {FS}                     from 'monterey-pal';
import {BasePlugin}             from '../base-plugin';
import {Detection}              from './detection';
import {Task}                   from '../task-manager/task';
import {CommandRunner}          from '../task-manager/command-runner';
import {PluginManager}          from '../../shared/plugin-manager';
import {Project}                from '../../shared/project';

const logger = <Logger>LogManager.getLogger('aurelia-cli-plugin');

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
    if (!showIrrelevant && !project.aureliaJSONPath) {
      return [];
    }

    return [{
      name: 'aurelia-cli',
      model: { relevant: !!project.aureliaJSONPath },
      viewModel: 'plugins/aurelia-cli/tile'
    }];
  }

  async evaluateProject(project: Project) {
    await this.detection.findAureliaJSONConfig(project);
  }

  async getProjectInfoSections(project) {
    if (project.aureliaJSONPath) {
      return [{ viewModel: 'plugins/aurelia-cli/project-info' }];
    }
    return [];
  }

  async getPostInstallTasks(project: Project): Promise<Array<Task>> {
    if (!project.isUsingAureliaCLI()) return;

    // the cliProject property gets set by the scaffolding wizard
    // so if this is truthy then we know the project was recently scaffolded
    if (!project.__meta__.cliProject) return;
    
    let postInstallProcesses = project.__meta__.cliProject.postInstallProcesses || [];
    let tasks = [];

    postInstallProcesses.forEach(proc => {
      tasks.push(new Task(project).fromPostInstallProcess(proc));
    });
    
    tasks.push(new Task(project, 'Loading project tasks', () => this.commandRunner.load(project, false)));

    tasks.push(this.commandRunner.runByCmd(project, 'au run --watch'));

    return tasks;
  }
}