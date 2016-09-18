import {BasePlugin}    from '../base-plugin';
import {Detection}     from './detection';
import {Task}          from '../task-manager/index';
import {Workflow}      from '../workflow/workflow';
import {Step}          from '../workflow/step';
import {CommandRunner} from '../task-manager/commands/command-runner';
import {Project, PluginManager, autoinject} from '../../shared/index';

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

    if (project.isUsingTypings()) {
      project.favoriteCommands.push({ command: 'node', args: ['node_modules/typings/dist/bin.js', 'install'] });
    }
  }

  async getProjectInfoSections(project: Project) {
    if (project.isUsingTypings()) {
      return [{ viewModel: 'plugins/typings/project-info' }];
    }
    return [];
  }

  async resolvePostInstallWorkflow(project: Project, workflow: Workflow) {
    if (!project.isUsingTypings()) return;

    let phase = workflow.getPhase('environment');

    if (!phase.stepExists('typings install')) {
      phase.addStep(new Step('typings install', 'typings install', this.commandRunner.run(project, {
        description: 'typings install',
        command: 'node',
        args: ['node_modules/typings/dist/bin.js', 'install']
      })));
    }
  }
}