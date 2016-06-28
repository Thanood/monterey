import {PluginManager} from '../../shared/plugin-manager';

export function configure(aurelia) {
  let pluginManager = aurelia.container.get(PluginManager);

  pluginManager.registerPlugin({
    name: 'NPM package manager',
    viewModel: 'plugins/npm-package-manager/npm-package-manager',
    view: 'plugins/default-view.html'
  });
}
