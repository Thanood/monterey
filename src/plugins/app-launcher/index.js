import {PluginManager} from '../../shared/plugin-manager';

export function configure(aurelia) {
  let pluginManager = aurelia.container.get(PluginManager);

  pluginManager.registerPlugin({
    name: 'App launcher',
    viewModel: 'plugins/app-launcher/app-launcher'
  });

  pluginManager.registerPlugin({
    name: 'Test',
    viewModel: 'plugins/app-launcher/app-launcher',
    view: 'plugins/default-view.html'
  });
}
