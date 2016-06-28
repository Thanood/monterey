import {inject, bindable}        from 'aurelia-framework';
import {PluginManager} from '../../shared/plugin-manager';

@inject(PluginManager)
export class Tiles {
  @bindable selectedProject;
  tiles = [];

  constructor(pluginManager) {
    this.pluginManager = pluginManager;
  }

  selectedProjectChanged() {
    // remove all tiles from the screen
    for (let i = this.tiles.length - 1; i >= 0; i--) {
      this.tiles.splice(i, 1);
    }

    // we're done if no project has been selected
    if (!this.selectedProject) {
      return;
    }

    // get a list of tiles to show from every plugin
    this.pluginManager.getTilesForPlugin(this.selectedProject)
    .forEach(plugin => this.tiles.push(plugin));
  }
}
