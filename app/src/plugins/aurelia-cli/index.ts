import {Detection}           from './detection';
import {CommandService}      from './command-service';
import {BasePlugin}          from '../base-plugin';
import {Workflow}            from '../workflow/workflow';
import {Step}                from '../workflow/step';
import {CommandRunner, Task, Command, CommandTree} from '../task-manager/index';
import {PluginManager, Project, Logger, Notification, FS, OS, autoinject, LogManager} from '../../shared/index';

const logger = <Logger>LogManager.getLogger('aurelia-cli-plugin');

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

@autoinject()
export class Plugin extends BasePlugin {
  constructor(private detection: Detection,
              private notification: Notification,
              private commandRunner: CommandRunner) {
    super();
  }

  async evaluateProject(project: Project) {
    await this.detection.findAureliaJSONConfig(project);

    if (project.isUsingAureliaCLI()) {
      let workflow = project.addOrCreateWorkflow('Run');
      workflow.children.push(new CommandTree({
        command: new Command('au', ['run', '--watch'])
      }));

      project.favoriteCommands.push(new Command('au', ['run']));
      project.favoriteCommands.push(new Command('au', ['run', '--watch']));
    }
  }

  async getProjectInfoSections(project) {
    if (project.aureliaJSONPath) {
      return [{ viewModel: 'plugins/aurelia-cli/project-info' }];
    }
    return [];
  }

  async resolvePostInstallWorkflow(project: Project, workflow: Workflow, pass: number) {
    if (!project.isUsingAureliaCLI()) return;

    let phase = workflow.getPhase('run');

    if (pass === 1) {
      let cli_installed = true;
      try {
        await OS.exec('au help', { cwd: project.path });
      } catch (err) {
        cli_installed = false;
        this.notification.error('Error during "au help". Did you install aurelia-cli? npm install aurelia-cli -g');
        logger.error(err);
      }

      if (!phase.stepExists('au run --watch') && cli_installed) {
        let command = new Command('au', ['run', '--watch']);
        phase.addStep(new Step('au run --watch', 'au run --watch', this.commandRunner.run(project, command)));
      }
    }
  }

  async getCommandServices(project: Project): Promise<Array<any>> {
    if (!project.isUsingAureliaCLI()) return;

    return [CommandService];
  }
}