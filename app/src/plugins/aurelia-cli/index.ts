import {autoinject, LogManager} from 'aurelia-framework';
import {Logger}                 from 'aurelia-logging';
import {FS}                     from 'monterey-pal';
import {BasePlugin}             from '../base-plugin';
import {Detection}              from './detection';
import {Task}                   from '../task-manager/task';
import {CommandRunner}          from '../task-manager/command-runner';
import {Workflow}               from '../../project-installation/workflow';
import {Step}                   from '../../project-installation/step';
import {PluginManager}          from '../../shared/plugin-manager';
import {Project}                from '../../shared/project';
import {CommandService}         from './command-service';

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

  async resolvePostInstallWorkflow(project: Project, workflow: Workflow) {
    if (!project.isUsingAureliaCLI()) return;

    if (!workflow.phases.run.stepExists('au run --watch')) {
      let t = new Task(project, 'fetch tasks', () => this.commandRunner.getCommands(project, false));
      workflow.phases.run.addStep(new Step('fetch tasks', 'fetch tasks', t));
      workflow.phases.run.addStep(new Step('au run --watch', 'au run --watch', this.commandRunner.runByCmd(project, 'au run --watch')));
    }
  }

  async getCommandServices(project: Project): Promise<Array<any>> {
    if (!project.isUsingAureliaCLI()) return;

    return [CommandService];
  }
}