import {autoinject, LogManager} from 'aurelia-framework';
import {PluginManager}          from '../../shared/plugin-manager';
import {ApplicationState}       from '../../shared/application-state';
import {BasePlugin}             from '../base-plugin';
import * as defaults            from './defaults.json!';
import {OS}                     from 'monterey-pal';
import {LauncherManager}        from './launcher-manager';

const logger = LogManager.getLogger('App launcher plugin');

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

@autoinject()
class Plugin extends BasePlugin {

  constructor(private state: ApplicationState, 
              private manager: LauncherManager) {
    super();
    this.state = state;
    this.manager = manager;
  }

  getTiles(project, showIrrelevant) {
    let tiles = [{
      viewModel: 'plugins/app-launcher/editor-tile',
      model: null
    }];

    this.state.appLaunchers.forEach(launcher => {
      if (launcher.data.enabled) {
        tiles.push({
          viewModel: 'plugins/app-launcher/tile',
          model: launcher.data
        });
      }
    });

    return tiles;
  }

  async onNewSession(state) {
    let platform = OS.getPlatform();

    // Install any default launchers
    let launchers = (<any>defaults).defaults[platform];

    launchers.forEach(launcher => {
      try {
        this.manager.installLauncher(platform, launcher);
      } catch (e) {
        logger.error(e);
      }
    });
  }
}
