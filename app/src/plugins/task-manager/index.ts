import {autoinject}    from 'aurelia-framework';
import {PluginManager} from '../../shared/plugin-manager';
import {BasePlugin}    from '../base-plugin';
import {Settings}      from '../../shared/settings';

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

@autoinject()
class Plugin extends BasePlugin {
  constructor(private settings: Settings) {
    super();

    this.settings.addSetting({ 
      identifier: 'show-finished-tasks', 
      title: 'Show finished tasks in taskmanager?', 
      type: 'boolean', 
      value: true 
    });
  }
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