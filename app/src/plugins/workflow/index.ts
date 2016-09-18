import {BasePlugin}  from '../base-plugin';
import {CommandTree} from '../task-manager/index';
import {Project, PluginManager, autoinject} from '../../shared/index';

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

@autoinject()
export class Plugin extends BasePlugin {
  getTiles(project: Project, showIrrelevant) {
    let tiles = [];

    let workflows = project.workflowTrees.filter(x => x.tile);

    for (let x of workflows) {
      tiles.push({
        name: `workflow-${x.name}`,
        model: { title: x.name, tree: new CommandTree(x) },
        viewModel: 'plugins/workflow/tile'
      });
    }

    tiles.push({
      name: 'workflow-editor',
      viewModel: 'plugins/workflow/editor-tile',
      model: null
    });

    return tiles;
  }
}