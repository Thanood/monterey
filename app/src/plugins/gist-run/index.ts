import {PluginManager} from '../../shared/index';
import {BasePlugin}    from '../base-plugin';

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

class Plugin extends BasePlugin {
  getTiles(project, showIrrelevant) {
    return [{
      name: 'gistrun',
      viewModel: 'plugins/gist-run/tile'
    }];
  }
}
