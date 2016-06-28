export class PluginManager {

  plugins = [];

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
  evaluateProject(project) {
    this.plugins.forEach(plugin => plugin.evaluateProject(project));
  }

  /**
  * Collects an array of tiles by calling the getTiles function of every plugin
  */
  getTilesForPlugin(project) {
    let tiles = [];

    this.plugins.forEach(plugin => {
      plugin.getTiles(project)
      .forEach(tile => tiles.push(tile));
    });

    return tiles;
  }
}
