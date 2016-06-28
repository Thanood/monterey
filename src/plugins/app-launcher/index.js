import {PluginManager}     from '../../shared/plugin-manager';
import {BasePlugin}              from '../base-plugin';

export function configure(aurelia) {
  let pluginManager = aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

class Plugin extends BasePlugin {
  getTiles(project) {
    return [{
      viewModel: 'plugins/app-launcher/tile',
      model: {
        img: 'http://icons.iconarchive.com/icons/dakirby309/simply-styled/128/File-Explorer-icon.png',
        cmd: `explorer ${project.path}`,
        title: 'File explorer'
      }
    }, {
      viewModel: 'plugins/app-launcher/tile',
      model: {
        img: 'https://upload.wikimedia.org/wikipedia/en/e/ef/Command_prompt_icon_(windows).png',
        cmd: `start cmd.exe /k "cd /d ${project.path}"`,
        title: 'cmd'
      }
    }];
  }
}
