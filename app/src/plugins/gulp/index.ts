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
    if (!showIrrelevant && !project.isUsingGulp()) {
      return [];
    }

    return [{
      model: { relevant: project.isUsingGulp() },
      viewModel: 'plugins/gulp/tile'
    }];
  }

  async evaluateProject(project: Project) {
    let lookupPaths = [
      FS.join(project.path, 'gulpfile.js'),
      FS.join(project.path, 'src', 'skeleton', 'gulpfile.js'),
      FS.join(project.path, 'src', 'skeleton-navigation-esnext-vs', 'gulpfile.js'),
      FS.join(project.path, 'src', 'skeleton-navigation-typescript-vs', 'gulpfile.js'),
      FS.join(FS.getFolderPath(project.packageJSONPath), 'gulpfile.js')
    ];

    for (let i = 0; i < lookupPaths.length; i++) {
      if (await FS.fileExists(lookupPaths[i])) {
        project.gulpfile = lookupPaths[i];
      }
    };
  }

  async getProjectInfoSections(project: Project) {
    if (project.isUsingGulp()) {
      return [{ viewModel: 'plugins/gulp/project-info' }];
    }
    return [];
  }
}