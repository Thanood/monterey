import {BasePlugin}  from '../base-plugin';
import {CommandTree} from '../task-manager/index';
import {Project, Settings, PluginManager, autoinject} from '../../shared/index';

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

@autoinject()
export class Plugin extends BasePlugin {

  constructor(private settings: Settings) {
    super();

    this.settings.addSetting({
      identifier: 'show-taskmanager-on-workflow-start',
      title: 'Show taskmanager when starting workflow (such as Run workflow)',
      type: 'boolean',
      value: true
    });
  }

  getTiles(project: Project, showIrrelevant) {
    let tiles = [];

    let workflows = project.workflowTrees.filter(x => x.tile);

    for (let x of workflows) {
      tiles.push({
        name: `workflow-${x.name}`,
        model: { title: x.name, tree: x },
        viewModel: 'plugins/workflow/tile'
      });
    }

    // tiles.push({
    //   name: 'workflow-editor',
    //   viewModel: 'plugins/workflow/editor-tile',
    //   model: null
    // });

    return tiles;
  }
}