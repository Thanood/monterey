import {autoinject}    from 'aurelia-framework';
import {BasePlugin}    from '../base-plugin';
import {Detection}     from './detection';
import {PluginManager} from '../../shared/plugin-manager';
import {Project}       from '../../shared/project';
import {Task}          from '../task-manager/task';
import {Workflow}      from '../../project-installation/workflow';
import {Step}          from '../../project-installation/step';
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

  async resolvePostInstallWorkflow(project: Project, workflow: Workflow) {
    if (!project.isUsingTypings()) return;

    let phase = workflow.getPhase('environment');

    if (!phase.stepExists('typings install')) {
      phase.addStep(new Step('typings install', 'typings install', new Task(project).fromCommand({
        description: 'typings install',
        command: 'node',
        args: ['node_modules/typings/dist/bin.js', 'install']
      })));
    }
  }
}