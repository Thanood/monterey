import {autoinject, Container} from 'aurelia-framework';
import {BasePlugin}            from '../plugins/base-plugin';
import {Task}                  from '../plugins/task-manager/task';
import {Workflow}              from '../plugins/workflow/workflow';
import {Phase}                 from '../plugins/workflow/phase';
import {CommandRunnerService}  from '../plugins/task-manager/commands/command-runner-service';
import {Project}               from './project';
import {ApplicationState}      from './application-state';

/**
 * The PluginManager is aware of all plugins of Monterey. Plugins are required to register
 * themselves with thte PluginManager, in order to be able to respond to system-wide events.
 */
@autoinject()
export class PluginManager {

  plugins: Array<BasePlugin> = [];

  constructor(private container: Container) {}

  /**
  * At application startup all plugins must register themselves with the PluginManager
  */
  registerPlugin(plugin: BasePlugin) {
    this.plugins.push(plugin);
  }

  /**
  * Whenever a project gets added to monterey, plugins have the opportunity
  * to evaluate the project and provide information of it to the monterey system
  */
  async evaluateProject(project: Project) {
    await this.call('evaluateProject', project);
    return project;
  }

  /**
   * Notifies every plugin of the fact that a new Monterey session has started
   */
  async notifyOfNewSession(state: ApplicationState) {
    await this.call('onNewSession', state);
    return state;
  }

  /**
   * Notifies every project of the fact that a project has been added to Monterey
   */
  async notifyOfAddedProject(project: Project) {
    await this.call('onProjectAdd', project);
    return project;
  }

  async getTaskBarItems(project: Project): Promise<Array<string>> {
    let items = await this.call('getTaskBarItems', project);
    return items;
  }

  async getCommandServices(project: Project): Promise<Array<CommandRunnerService>> {
    let items = await this.call('getCommandServices', project);

    let services = items.filter(x => !!x).map(x => this.container.get(x));

    return services;
  }

  /**
   * resolvePostInstallWorkflow gives plugins multiple opportunities to resolve the post install workflow
   */
  async resolvePostInstallWorkflow(project: Project, workflow: Workflow) {
    async function cycle (project: Project, workflow: Workflow, pass: number) {
      for (let x = 0; x < this.plugins.length; x++) {
        await this.plugins[x].resolvePostInstallWorkflow(project, workflow, pass);
      }
    }

    // plugins get three opportunities to make changes to the workflow
    let cycles = 3;

    for (let x = 1; x < (cycles + 1); x++) {
      await cycle.call(this, project, workflow, x);

      for (let phase in workflow.phases) {
        (<Phase>workflow.phases[phase]).sort();
      }

      // here all tasks are added
      // so we set the task dependencies here and
      // allow plugins to override in cycle 2 and 3
      if (x === 1) {
        let prevPhaseTask;
        for (let phase in workflow.phases) {
          let p = <Phase>workflow.phases[phase];
          let prevTask;
          p.steps.forEach(step => {
            if (prevTask) {
              step.task.dependsOn = prevTask;
            } else if (prevPhaseTask) {
              step.task.dependsOn = prevPhaseTask;
            }
            prevTask = step.task;
            prevPhaseTask = step.task;
          });
        }
      }
    }

    return workflow;
  }


  /**
   * Call a function on all plugins
   */
  private async call(func: string, ...params) {
    let result = [];
    let p = Array.prototype.slice.call(params);
    for (let i = 0; i < this.plugins.length; i++) {
      result = result.concat(await this.plugins[i][func].apply(this.plugins[i], p));
    }
    return result;
  }

  /**
  * Collects an array of tiles by calling the getTiles function of every plugin
  */
  getTilesForProject(project: Project, showIrrelevant: boolean) {
    let tiles = [];

    this.plugins.forEach(plugin => {
      plugin.getTiles(project, showIrrelevant)
      .forEach(tile => tiles.push(tile));
    });

    // enforce unique names for tiles
    tiles.forEach(tile => {
      if (!tile.name || tiles.filter(x => x.name === tile.name).length > 1) {
        console.log(tile);
        throw new Error('A tile must have a unique name');
      }
    });

    return tiles;
  }
}
