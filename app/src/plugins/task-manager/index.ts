import {autoinject}              from 'aurelia-framework';
import {PluginManager, Settings} from '../../shared/index';
import {BasePlugin}              from '../base-plugin';
export * from './task';
export * from './task-manager';
export * from './command';
export * from './command-runner';
export * from './command-runner-service';

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