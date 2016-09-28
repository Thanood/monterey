import {BasePlugin}             from '../base-plugin';
import {Detection}              from './detection';
import {Workflow}               from '../workflow/workflow';
import {Step}                   from '../workflow/step';
import {Errors}                 from '../errors/errors';
import {CommandService}         from './command-service';
import {Task, CommandRunner, Command, CommandTree}    from '../task-manager/index';
import {PluginManager, Project, Notification, OS, FS, Logger, LogManager, autoinject} from '../../shared/index';

const logger = <Logger>LogManager.getLogger('dotnet plugin');

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

@autoinject()
export class Plugin extends BasePlugin {
  constructor(private detection: Detection,
              private commandRunner: CommandRunner,
              private notification: Notification,
              private errors: Errors) {
    super();
  }

  async evaluateProject(project: Project) {
    await this.detection.detect(project);

    if (project.isUsingDotnetCore()) {
      let workflow = project.addOrCreateWorkflow('Run');
      workflow.children.push(new CommandTree({
        command: new Command('dotnet', ['run'])
      }));

      project.favoriteCommands.push(new Command('dotnet', ['run']));
    }
  }

  async getProjectInfoSections(project: Project) {
    if (project.isUsingDotnetCore()) {
      return [{ viewModel: 'plugins/dotnet/project-info' }];
    }
    return [];
  }

  async resolvePostInstallWorkflow(project: Project, workflow: Workflow, pass: number) {
    if (!project.isUsingDotnetCore()) return;

    if (pass === 1) {
      let dotnetInstalled = false;
      try {
        // making sure that dotnet is installed
        let cwd = project.packageJSONPath ? FS.getFolderPath(project.packageJSONPath) : project.path;
        await OS.exec('dotnet --help', { cwd: cwd });

        dotnetInstalled = true;
      } catch (err) {
        this.notification.error('Error during "dotnet --help", did you install dotnet core?');
        logger.error(err);
        this.errors.add(err);
      }

      if (!dotnetInstalled) return;

      if (!workflow.getPhase('environment').stepExists('dotnet restore')) {
        let cmd = new Command('dotnet', ['restore']);
        workflow.getPhase('environment').addStep(new Step('dotnet restore', 'dotnet restore', this.commandRunner.run(project, cmd)));
      }

      if (!workflow.getPhase('run').stepExists('dotnet run')) {
        let cmd = new Command('dotnet', ['run']);
        workflow.getPhase('run').addStep(new Step('dotnet run', 'dotnet run', this.commandRunner.run(project, cmd)));
      }
    }

    if (pass === 2) {
      let runPhase = workflow.getPhase('run');

      // dotnet run and gulp watch needs to run at the same time
      // so they can't depend on eachother, they need to depend on the task before dotnet run and gulp watch
      if (runPhase.stepExists('dotnet run') && runPhase.stepExists('gulp watch')) {
       let dotnet =  runPhase.getStep('dotnet run');
       let gulp = runPhase.getStep('gulp watch');
       (dotnet.order > gulp.order) ? dotnet.task.dependsOn = gulp.task.dependsOn : gulp.task.dependsOn = dotnet.task.dependsOn;
      }
    }
  }

  async getCommandServices(project: Project): Promise<Array<any>> {
    if (!project.isUsingDotnetCore()) return;

    return [CommandService];
  }
}