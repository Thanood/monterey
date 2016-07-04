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

      await this.findJspmVersion(project, packageJSON);
      let major = parseInt(jspmVersion.split('.')[0], 10);
      let minor = parseInt(jspmVersion.split('.')[1], 10);
      if (major === 0) {
        if (minor < 17) {
          // old config.js - use what we have below
        } else {
          // TODO: new config - read from package.json
        }
      }

      let baseURL = '';
      if (packageJSON.jspm.directories && packageJSON.jspm.directories.baseURL) {
        baseURL = packageJSON.jspm.directories.baseURL;
      }
      configJs = project.path + '/' + baseURL + '/config.js';
      console.log('cfg', configJs);
    }

    if (configJs) {
      project.configJsPath = configJs;
    }
    project.isUsingJSPM = isUsingJSPM;
  }

  async findJspmVersion(project, packageJSON) {
    let jspmDefinition = (packageJSON.dependencies && packageJSON.dependencies.jspm) || (packageJSON.devDependencies && packageJSON.devDependencies.jspm);
    let jspmVersion = null;
    if (jspmDefinition) {
      jspmVersion = jspmDefinition;
      if (jspmVersion[0] === '^' || jspmVersion[0] === '~') {
        jspmVersion = jspmVersion.substring(1);
      }
      project.jspmVersion = jspmDefinition;
    } else {
      // TODO: JSPM not found in package.json dependencies - throw error?
    }
  }
}
