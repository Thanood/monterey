import {PluginManager} from '../../shared/plugin-manager';
import {Main}          from '../../main/main';

export function configure(aurelia) {
  let pluginManager = aurelia.container.get(PluginManager);
  let main = aurelia.container.get(Main);

  pluginManager.registerPlugin({
    name: 'NPM package manager',
    onClick: (e) => {
      main.activateScreen('plugins/npm-package-manager/screen');
    }
  });
}
