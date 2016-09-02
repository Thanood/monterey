import {autoinject}    from 'aurelia-framework';
import {PluginManager} from '../../shared/plugin-manager';
import {BasePlugin}    from '../base-plugin';
import {Detection}     from './detection';
import {Project}       from '../../shared/project';
import {Task}          from '../task-manager/task';
import {Workflow}      from '../../project-installation/workflow';
import {Step}          from '../../project-installation/step';
import {CommandRunner} from '../task-manager/command-runner';
import {CommandService} from './command-service';
import {CommandRunnerService} from '../task-manager/command-runner-service';

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

  async resolvePostInstallWorkflow(project: Project, workflow: Workflow) {
    if (!project.isUsingGulp()) return;

    if (!workflow.phases.run.stepExists('gulp watch')) {
      let t = new Task(project, 'fetch tasks', () => this.commandRunner.getCommands(project, false));
      t.description = 'Gets all available gulp/aurelia-cli/webpack commands';
      workflow.phases.run.addStep(new Step('fetch tasks', 'fetch tasks', t));
      workflow.phases.run.addStep(new Step('gulp watch', 'gulp watch', this.commandRunner.runByCmd(project, 'gulp watch')));
    }
  }

  async getCommandServices(project: Project): Promise<Array<any>> {
    if (!project.isUsingGulp()) return;

    return [CommandService];
  }
}