import {PluginManager} from '../../shared/plugin-manager';
import {inject}        from 'aurelia-framework';
import {Fs}            from '../../shared/abstractions/fs';
import {BasePlugin}    from '../base-plugin';

export function configure(aurelia) {
  let pluginManager = aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

@inject(Fs)
class Plugin extends BasePlugin {
  constructor(fs) {
    super();
    this.fs = fs;
  }

  getTiles(project) {
    return [{
      viewModel: 'plugins/npm/tile'
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
      project.name = this.fs.getDirName(project.path);
    }

    return project;
  }

  async manuallyLocatePackageJSON(project) {
    alert('Unable to find package.json, please point Monterey to package.json');
    let paths = await this.fs.showOpenDialog({
      title: 'Please select your package.JSON file',
      properties: ['openFile'],
      defaultPath: project.path,
      filters: [
        {name: 'package', extensions: ['json']}
      ]
    });

    if (paths && paths.length > 0) {
      console.log('manuallyLocatePackageJSON: true')
      return await this.tryLocatePackageJSON(project, paths[0]);
    }

    console.log('manuallyLocatePackageJSON: false')
    return false;
  }

  async tryLocatePackageJSON(project, p) {
    if (await this.fs.fileExists(p)) {
      project.packageJSONPath = p;

      let packageJSON = JSON.parse(await this.fs.readFile(project.packageJSONPath));
      project.name = packageJSON.name;
      console.log('tryLocatePackageJSON: true')
      return true;
    }

    console.log('tryLocatePackageJSON: false')
    return false;
  }
}
