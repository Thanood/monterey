export class PluginManager {

  plugins = [];

  registerPlugin(plugin) {
    if (!plugin.name) {
      throw new Error('Plugin must have a name');
    }

    if (!plugin.viewModel) {
      plugin.viewModel = 'plugins/default-tile';
    }

    this.plugins.push(plugin);
  }

  getPluginForProject(project) {
    return this.plugins;
  }
}
