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
    if (!showIrrelevant && !project.aureliaJSONPath) {
      return [];
    }

    return [{
      model: { relevant: !!project.aureliaJSONPath },
      viewModel: 'plugins/aurelia-cli/tile'
    }];
  }

  async evaluateProject(project: Project) {
    let lookupPaths = [
      FS.join(project.path, 'aurelia_project', 'aurelia.json')
    ];

    for(let i = 0; i < lookupPaths.length; i++) {
      if (await FS.fileExists(lookupPaths[i])) {
        project.aureliaJSONPath = lookupPaths[i];
      }
    };
  }

  async getProjectInfoSections(project) {
    if (project.aureliaJSONPath) {
      return [{ viewModel: 'plugins/aurelia-cli/project-info' }];
    }
    return [];
  }

  async getTaskBarItems(project: Project) {
    return ['plugins/aurelia-cli/task-bar'];
  }
}