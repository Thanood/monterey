import {autoinject}     from 'aurelia-framework';
import {BasePlugin}     from '../base-plugin';
import {Detection}      from './detection';
import {CommandService} from './command-service';
import {Workflow}       from '../workflow/workflow';
import {Step}           from '../workflow/step';
import {PluginManager, Project}                    from '../../shared/index';
import {Task, CommandRunner, CommandRunnerService} from '../task-manager/index';

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

    if (project.isUsingGulp()) {
      let workflow = project.addOrCreateWorkflow('Run');
      workflow.children.unshift(<any>{
        command: {
          command: 'gulp',
          args: ['watch']
        }
      });
    }
  }

  async getProjectInfoSections(project: Project) {
    if (project.isUsingGulp()) {
      return [{ viewModel: 'plugins/gulp/project-info' }];
    }
    return [];
  }

  async resolvePostInstallWorkflow(project: Project, workflow: Workflow) {
    if (!project.isUsingGulp()) return;

    let runPhase = workflow.getPhase('run');

    if (!runPhase.stepExists('gulp watch')) {
      runPhase.addStep(new Step('gulp watch', 'gulp watch', this.commandRunner.run(project, {
        command: 'gulp',
        args: ['watch']
      })));
    }
  }

  async getCommandServices(project: Project): Promise<Array<any>> {
    if (!project.isUsingGulp()) return;

    return [CommandService];
  }
}