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
    let pathsToTry = [
      `${project.path}/package.json`,
      `${project.path}/src/skeleton-navigation-esnext-vs/package.json`,
      `${project.path}/src/skeleton-navigation-typescript-vs/package.json`
    ];

    let found = false;
    for (let i = 0; i < pathsToTry.length; i++) {
      if (await this.tryLocatePackageJSON(project, pathsToTry[i])) {
        found = true;
      }
    }

    if (!found) {
      if (await this.manuallyLocatePackageJSON(project)) {
        found = true;
      }
    }

    if (!found) {
      project.name = FS.getDirName(project.path);
    } else {
      // await this.findJspmConfig(project);
    }

    return project;
  }

  async manuallyLocatePackageJSON(project) {
    alert('Unable to find package.json, please point Monterey to package.json');
    let paths = await FS.showOpenDialog({
      title: 'Please select your package.JSON file',
      properties: ['openFile'],
      defaultPath: project.path,
      filters: [
        {name: 'package', extensions: ['json']}
      ]
    });

    if (paths && paths.length > 0) {
      return await this.tryLocatePackageJSON(project, paths[0]);
    }

    return false;
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
      console.log('configJS', configJs);
    } else {
      console.log('not using jspm');
    }
    if (configJs) {
      project.configJsPath = configJs;
    }
    project.isUsingJSPM = isUsingJSPM;
    return isUsingJSPM;
  }

  async tryLocatePackageJSON(project, p) {
    if (await FS.fileExists(p)) {
      project.packageJSONPath = p;

      let packageJSON = JSON.parse(await FS.readFile(project.packageJSONPath));
      project.name = packageJSON.name;
      await this.findJspmConfig(project, packageJSON);
      return true;
    }

    return false;
  }
}
