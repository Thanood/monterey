import {PluginManager} from '../../shared/plugin-manager';
import {BasePlugin}    from '../base-plugin';
import {FS}            from 'monterey-pal';
import {Project}       from '../../shared/project';

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

class Plugin extends BasePlugin {
  getTiles(project: Project, showIrrelevant) {
    if (!showIrrelevant && !project.webpackConfigPath) {
      return [];
    }

    return [{
      model: { relevant: !!project.webpackConfigPath },
      viewModel: 'plugins/webpack/tile'
    }];
  }

  async evaluateProject(project: Project) {
    let lookupPaths = [
      FS.join(project.path, 'webpack.config.js')
    ];

    for(let i = 0; i < lookupPaths.length; i++) {
      if (await FS.fileExists(lookupPaths[i])) {
        project.webpackConfigPath = lookupPaths[i];
      }
    };
  }

  async getProjectInfoSections(project) {
    if (project.aureliaJSONPath) {
      return [{ viewModel: 'plugins/webpack/project-info' }];
    }
    return [];
  }
}