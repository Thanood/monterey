import {autoinject}    from 'aurelia-framework';
import {Settings, PluginManager} from '../../shared/index';
import {OtherSettings}           from './other-settings';
import {BasePlugin}              from '../base-plugin';

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

@autoinject()
class Plugin extends BasePlugin {

  constructor(private settings: Settings,
              private otherSettings: OtherSettings) {
    super();

    otherSettings.add(settings);
  }

  async getTaskBarItems(project) {
    return ['plugins/preferences/task-bar'];
  }
}
