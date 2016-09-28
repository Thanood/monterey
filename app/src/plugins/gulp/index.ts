import {BasePlugin}     from '../base-plugin';
import {Detection}      from './detection';
import {CommandService} from './command-service';
import {Workflow}       from '../workflow/workflow';
import {Step}           from '../workflow/step';
import {PluginManager, Project, autoinject} from '../../shared/index';
import {Task, CommandRunner, Command, CommandTree, CommandRunnerService} from '../task-manager/index';

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
    await this.detection.findGulpConfig(project);

    if (project.isUsingGulp()) {
      let workflow = project.addOrCreateWorkflow('Run');
      workflow.children.unshift(new CommandTree({
        command: new Command('gulp', ['watch'])
      }));

      project.favoriteCommands.push(new Command('gulp', ['watch']));
      project.favoriteCommands.push(new Command('gulp', ['build']));
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
      runPhase.addStep(new Step('gulp watch', 'gulp watch', this.commandRunner.run(project, new Command('gulp', ['watch']))));
    }
  }

  async getCommandServices(project: Project): Promise<Array<any>> {
    if (!project.isUsingGulp()) return;

    return [CommandService];
  }
}