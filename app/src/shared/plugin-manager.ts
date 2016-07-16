import {BasePlugin}       from '../plugins/base-plugin';
import {Project}          from './project';
import {ApplicationState} from './application-state';

export class PluginManager {

  plugins: Array<BasePlugin> = [];

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
    for (let i = 0; i < this.plugins.length; i++) {
      await this.plugins[i].evaluateProject(project);
    }
    return project;
  }

  /**
   * Notifies every plugin of the fact that a new Monterey session has started
   */
  async notifyOfNewSession(state: ApplicationState) {
    for (let i = 0; i < this.plugins.length; i++) {
      await this.plugins[i].onNewSession(state);
    }
    return state;
  }

  /**
   * Notifies every project of the fact that a project has been added to Monterey
   */
  async notifyOfAddedProject(project: Project) {
    for (let i = 0; i < this.plugins.length; i++) {
      await this.plugins[i].onProjectAdd(project);
    }
    return project;
  }

  /**
  * Collects an array of tiles by calling the getTiles function of every plugin
  */
  getTilesForPlugin(project: Project, showIrrelevant: boolean) {
    let tiles = [];

    this.plugins.forEach(plugin => {
      plugin.getTiles(project, showIrrelevant)
      .forEach(tile => tiles.push(tile));
    });

    return tiles;
  }
}
