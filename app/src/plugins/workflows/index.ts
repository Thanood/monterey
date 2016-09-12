import {autoinject} from 'aurelia-framework';
import {BasePlugin}    from '../base-plugin';
import {PluginManager} from '../../shared/plugin-manager';
import {Project}       from '../../shared/project';

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

@autoinject()
export class Plugin extends BasePlugin {
  getTiles(project: Project, showIrrelevant) {
    return [{
      name: 'dotnet',
      model: { title: 'Run' },
      viewModel: 'plugins/workflows/tile'
    }];
  }
}