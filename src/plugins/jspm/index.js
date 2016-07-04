import {PluginManager} from '../../shared/plugin-manager';
import {FS}            from 'monterey-pal';
import {BasePlugin}    from '../base-plugin';

export function configure(aurelia) {
  let pluginManager = aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

class Plugin extends BasePlugin {
  getTiles(project) {
    return [{
      viewModel: 'plugins/jspm/tile'
    }];
  }

  async evaluateProject(project) {
    if (project.packageJSONPath) {
      let packageJSON = JSON.parse(await FS.readFile(project.packageJSONPath));
      await this.findJspmConfig(project, packageJSON);
    }
  }

  async findJspmConfig(project, packageJSON) {
    let isUsingJSPM = false;
    let configJs = null;

    if (packageJSON.jspm) {
      isUsingJSPM = true;

      let baseURL = '';
      if (packageJSON.jspm.directories && packageJSON.jspm.directories.baseURL) {
        baseURL = packageJSON.jspm.directories.baseURL;
      }
      configJs = project.path + '/' + baseURL + '/config.js';
    }

    if (configJs) {
      project.configJsPath = configJs;
    }
    project.isUsingJSPM = isUsingJSPM;
    return isUsingJSPM;
  }
}
