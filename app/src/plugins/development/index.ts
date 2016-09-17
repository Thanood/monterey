import {BasePlugin} from '../base-plugin';
import {ApplicationState, Settings, PluginManager, autoinject, SESSION} from '../../shared/index';

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

@autoinject()
class Plugin extends BasePlugin {
  constructor(private state: ApplicationState,
              private settings: Settings) {
    super();

    if (SESSION.getEnv() === 'development') {
      this.settings.addSetting({
        identifier: 'show-development-tools',
        title: 'Show development tools?',
        type: 'boolean',
        value: true
      });
    }
  }

  async getTaskBarItems(project) {
    if (this.settings.getValue('show-development-tools')) {
      return ['plugins/development/task-bar'];
    }

    return [];
  }
}