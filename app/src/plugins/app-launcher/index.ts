import {autoinject, LogManager} from 'aurelia-framework';
import {PluginManager}          from '../../shared/plugin-manager';
import {ApplicationState}       from '../../shared/application-state';
import {Project}                from '../../shared/project';
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

  getTiles(project: Project, showIrrelevant) {
    let tiles = [{
      name: 'app-launcher-editor',
      viewModel: 'plugins/app-launcher/editor-tile',
      model: null
    }];

    let launchers = (project.appLaunchers || []).concat(this.state.appLaunchers || []);

    launchers.forEach(launcher => {
      // how many launchers are there with the same title?
      // needed to create a unique tile name
      let launchersSameName = tiles.filter(x => x.name.startsWith(`app-launcher-${launcher.data.title}`)).length;
      tiles.push({
        name: `app-launcher-${launcher.data.title}-${launchersSameName}`,
        viewModel: 'plugins/app-launcher/tile',
        model: launcher.data
      });
    });

    return tiles;
  }

  async onNewSession(state) {
    let platform = OS.getPlatform();

    // Install any default launchers
    let launchers = (<any>defaults).defaults[platform];

    if (launchers) {
      launchers.forEach(launcher => {
        try {
          this.manager.installLauncher(undefined, platform, launcher);
        } catch (e) {
          logger.error(e);
        }
      });
    }
  }
}
