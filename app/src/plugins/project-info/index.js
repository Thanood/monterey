import {PluginManager} from '../../shared/plugin-manager';
import {BasePlugin}    from '../base-plugin';

export function configure(aurelia) {
  let pluginManager = aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

class Plugin extends BasePlugin {
  getTiles(project, relevant) {
    return [{
      viewModel: 'plugins/project-info/tile'
    }];
  }
}
