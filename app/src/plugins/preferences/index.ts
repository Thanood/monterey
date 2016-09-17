import {autoinject}    from 'aurelia-framework';
import {Settings, PluginManager} from '../../shared/index';
import {BasePlugin}              from '../base-plugin';

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

    this.settings.addSetting({
      identifier: 'language',
      title: 'Language',
      type: 'string',
      value: 'en',
      options: [
        { value: 'en', display: 'English' }
      ]
    });
  }

  async getTaskBarItems(project) {
    return ['plugins/preferences/task-bar'];
  }
}
