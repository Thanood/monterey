import {autoinject}      from 'aurelia-framework';
import {BasePlugin}      from '../base-plugin';
import {PluginManager}   from '../../shared/plugin-manager';
import {Project}         from '../../shared/project';
import {CommandTree}     from './command-tree';

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

@autoinject()
export class Plugin extends BasePlugin {
  getTiles(project: Project, showIrrelevant) {
    let tiles = [];

    for (let x of project.workflowTrees) {
      tiles.push({
        name: `workflow-${x.name}`,
        model: { title: x.name, tree: new CommandTree(x) },
        viewModel: 'plugins/workflow/tile'
      });
    }

    return tiles;
  }
}