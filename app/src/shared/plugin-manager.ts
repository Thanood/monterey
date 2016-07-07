import {BasePlugin} from '../plugins/base-plugin';

export class PluginManager {

  plugins: Array<BasePlugin> = [];

  /**
  * At application startup all plugins must register themselves with the PluginManager
  */
  registerPlugin(plugin) {
    this.plugins.push(plugin);
  }

  /**
  * Whenever a project gets added to monterey, plugins have the opportunity
  * to evaluate the project and provide information of it to the monterey system
  */
  async evaluateProject(project) {
    for (let i = 0; i < this.plugins.length; i++) {
      await this.plugins[i].evaluateProject(project);
    }
    return project;
  }

  async notifyOfNewSession(state) {
    for (let i = 0; i < this.plugins.length; i++) {
      await this.plugins[i].onNewSession(state);
    }
    return state;
  }

  async notifyOfAddedProject(project) {
    for (let i = 0; i < this.plugins.length; i++) {
      await this.plugins[i].onProjectAdd(project);
    }
    return project;
  }

  /**
  * Collects an array of tiles by calling the getTiles function of every plugin
  */
  getTilesForPlugin(project, showIrrelevant) {
    let tiles = [];

    this.plugins.forEach(plugin => {
      plugin.getTiles(project, showIrrelevant)
      .forEach(tile => tiles.push(tile));
    });

    return tiles;
  }
}
