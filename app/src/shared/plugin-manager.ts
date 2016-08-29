import {autoinject, Container} from 'aurelia-framework';
import {BasePlugin}            from '../plugins/base-plugin';
import {Project}               from './project';
import {Task}                  from '../plugins/task-manager/task';
import {ApplicationState}      from './application-state';
import {Workflow}              from '../project-installation/workflow';
import {CommandRunnerService}  from '../plugins/task-manager/command-runner-service';

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
      for(let x = 0; x < this.plugins.length; x++) {
        await this.plugins[x].resolvePostInstallWorkflow(project, workflow, pass);
      }
    }

    // plugins get three opportunities to make changes to the workflow
    let cycles = 3;

    for(let x = 1; x < (cycles + 1); x++) {
      await cycle.call(this, project, workflow, x);
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
      if(!tile.name || tiles.filter(x => x.name === tile.name).length > 1) {
        console.log(tile);
        throw new Error('A tile must have a unique name');
      }
    })

    return tiles;
  }
}
