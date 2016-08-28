import {autoinject}       from 'aurelia-framework';
import {PluginManager}    from '../../shared/plugin-manager';
import {BasePlugin}       from '../base-plugin';
import {ApplicationState} from '../../shared/application-state';
import {SESSION}          from 'monterey-pal';

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

@autoinject()
class Plugin extends BasePlugin {
  constructor(private state: ApplicationState) {
    super();
  }

  async onNewSession(state) {
    if (SESSION.getEnv() === 'development') {
      state.developmentToolsVisible = true;
    }
    return state;
  }

  async getTaskBarItems(project) {
    if (this.state.developmentToolsVisible) {
      return ['plugins/development/task-bar'];
    }

    return [];
  }
}