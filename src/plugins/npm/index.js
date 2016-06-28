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
    let packageJSONPath = this.fs.join(project.path, 'package.json');
    let packageJSON;
    try {
      packageJSON = JSON.parse(await this.fs.readFile(packageJSONPath));
    } catch (e) {
      alert(`Error loading package.json: ${packageJSONPath}`);
      console.log(e);
    }

    if (packageJSON) {
      project.name = packageJSON.name;
    }
    return project;
  }
}
