import {autoinject}          from 'aurelia-framework';
import {PluginManager}       from '../../shared/plugin-manager';
import {ApplicationState}    from '../../shared/application-state';
import {BasePlugin}          from '../base-plugin';
import * as defaults         from './defaults.json!';
import {OS}                  from 'monterey-pal';

export function configure(aurelia) {
  let pluginManager = aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

@autoinject()
class Plugin extends BasePlugin {
  constructor(private state: ApplicationState) {
    super();
    this.state = state;
  }

  getTiles(project, showIrrelevant) {
    let tiles = [{
      viewModel: 'plugins/app-launcher/editor-tile',
      model: null
    }];

    this.state.appLaunchers.forEach(launcher => {
      if (launcher.enabled) {
        tiles.push({
          viewModel: 'plugins/app-launcher/tile',
          model: launcher
        });
      }
    });

    return tiles;
  }

  createId() {
    return Math.floor((Math.random() * 999999999) + 111111111);
  }

  async onNewSession(state) {
    let platform = OS.getPlatform();

    let launchers = (<any>defaults).launchers;
    let defaultLaunchers = [];

    // only get launchers that are for this platform
    launchers.forEach(launcher => {
      if (launcher.platforms.indexOf(platform) > -1) {
        // automatically enable default launchers
        if (launcher.default) {
          launcher.enabled = true;
        } else {
          launcher.enabled = false;
        }

        defaultLaunchers.push(launcher);
      }
    });

     Object.assign(state, {
      appLaunchers: defaultLaunchers
    });
  }
}
