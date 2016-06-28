import {inject, bindable}        from 'aurelia-framework';
import {PluginManager} from '../../shared/plugin-manager';

@inject(PluginManager)
export class Plugins {
  @bindable selectedProject;
  plugins = [];

  constructor(pluginManager) {
    this.pluginManager = pluginManager;
  }

  selectedProjectChanged() {
    for (let i = this.plugins.length - 1; i >= 0; i--) {
      this.plugins.splice(i, 1);
    }

    if (!this.selectedProject) {
      return;
    }

    this.pluginManager.getPluginForProject(this.selectedProject)
    .forEach(plugin => this.plugins.push(plugin));
  }

  notifyPluginOfClick(plugin, e) {
    if (plugin.onClick) {
      plugin.onClick(e);
    }
  }
}
