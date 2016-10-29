import {PluginManager} from '../../shared/plugin-manager';
import {BasePlugin}    from '../base-plugin';

export function configure(aurelia) {
 let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

 pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

class Plugin extends BasePlugin {
 getTiles(project, showIrrelevant) {
   return [{
     name: 'Layoutmanager',
     viewModel: 'plugins/layout-manager/tile'
   }];
 }
}