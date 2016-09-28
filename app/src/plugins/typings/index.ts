import {BasePlugin}    from '../base-plugin';
import {Detection}     from './detection';
import {Task}          from '../task-manager/index';
import {Workflow}      from '../workflow/workflow';
import {Step}          from '../workflow/step';
import {CommandRunner, Command} from '../task-manager/index';
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

  async evaluateProject(project: Project) {
    await this.detection.findTypingsJSONFile(project);

    if (project.isUsingTypings()) {
      project.favoriteCommands.push(new Command('node', ['node_modules/typings/dist/bin.js', 'install'], 'typings install'));
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
      let cmd = new Command('node', ['node_modules/typings/dist/bin.js', 'install'], 'typings install');
      phase.addStep(new Step('typings install', 'typings install', this.commandRunner.run(project, cmd)));
    }
  }
}