import {PluginManager} from '../../shared/plugin-manager';
import {BasePlugin}    from '../base-plugin';

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

class Plugin extends BasePlugin {
  async getTaskBarItems(project) {
    return ['plugins/task-manager/task-bar'];
  }
  getTiles(project, showIrrelevant) {
    return [{
      name: 'Taskmanager',
      viewModel: 'plugins/task-manager/tile'
    }];
  }
}