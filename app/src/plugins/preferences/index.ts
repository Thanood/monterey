import {autoinject}    from 'aurelia-framework';
import {PluginManager} from '../../shared/plugin-manager';
import {Settings}      from '../../shared/settings';
import {BasePlugin}    from '../base-plugin';

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

@autoinject()
class Plugin extends BasePlugin {

  constructor(private settings: Settings) {
    super();

    this.settings.addSetting({
      identifier: 'theme',
      title: 'Theme',
      type: 'string',
      visible: false,
      value: 'default'
    });
  }

  async getTaskBarItems(project) {
    return ['plugins/preferences/task-bar'];
  }
}
