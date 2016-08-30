import {LogManager, autoinject} from 'aurelia-framework';
import {Logger}        from 'aurelia-logging';
import {BasePlugin}    from '../base-plugin';
import {Detection}     from './detection';
import {PluginManager} from '../../shared/plugin-manager';
import {Project}       from '../../shared/project';
import {Notification}  from '../../shared/notification';
import {Workflow}      from '../../project-installation/workflow';
import {Step}          from '../../project-installation/step';
import {Errors}        from '../errors/errors';
import {Task}          from '../task-manager/task';
import {CommandRunner} from '../task-manager/command-runner';
import {CommandService} from './command-service';
import {OS, FS}        from 'monterey-pal';

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

  getTiles(project: Project, showIrrelevant) {
    if (!showIrrelevant && !project.isUsingDotnetCore()) {
      return [];
    }

    return [{
      name: 'dotnet',
      model: { relevant: project.isUsingDotnetCore() },
      viewModel: 'plugins/dotnet/tile'
    }];
  }

  async evaluateProject(project: Project) {
    await this.detection.detect(project);
  }

  async getProjectInfoSections(project: Project) {
    if (project.isUsingDotnetCore()) {
      return [{ viewModel: 'plugins/dotnet/project-info' }];
    }
    return [];
  }

  async getPostInstallTasks(project: Project): Promise<Array<Task>> {
    if (!project.isUsingDotnetCore()) return;
    
    let tasks = [];

    let cwd = project.packageJSONPath ? FS.getFolderPath(project.packageJSONPath) : project.path;
    try {
      // making sure that dotnet is installed
      await OS.exec('dotnet --help', { cwd: cwd });

      tasks.push(new Task(project).fromPostInstallProcess({
        description: 'dotnet restore',
        command: 'dotnet',
        args: ['restore']
      }));
    } catch(err) {
      this.notification.error('Error during "dotnet --help", did you install dotnet core?');
      logger.error(err);
      this.errors.add(err);
    }

    return tasks;
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
      
      let t = new Task(project, 'fetch tasks', () => this.commandRunner.getCommands(project, false));
      workflow.phases.environment.addStep(new Step('fetch tasks', 'fetch tasks', t));

      if (!workflow.phases.environment.stepExists('dotnet restore')) {
        workflow.phases.environment.addStep(new Step('dotnet restore', 'dotnet restore', this.commandRunner.runByCmd(project, 'dotnet restore')));
      }

      
      if (!workflow.phases.run.stepExists('dotnet run')) {
        workflow.phases.run.addStep(new Step('dotnet run', 'dotnet run', this.commandRunner.runByCmd(project, 'dotnet run')));
      }
    }

    if (pass === 2) {
      // dotnet run and gulp watch needs to run at the same time
      // so they can't depend on eachother, they need to depend on the task before dotnet run and gulp watch
      if (workflow.phases.run.stepExists('dotnet run') && workflow.phases.run.stepExists('gulp watch')) {
       let dotnet =  workflow.phases.run.getStep('dotnet run');
       let gulp = workflow.phases.run.getStep('gulp watch');
       (dotnet.order > gulp.order) ? dotnet.task.dependsOn = gulp.task.dependsOn : gulp.task.dependsOn = dotnet.task.dependsOn;
      }
    }
  }

  async getCommandServices(project: Project): Promise<Array<any>> {
    if (!project.isUsingDotnetCore()) return;

    return [CommandService];
  }
}