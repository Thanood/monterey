import {PluginManager} from '../../shared/plugin-manager';
import {BasePlugin}    from '../base-plugin';
import {FS}            from 'monterey-pal';
import {Project}       from '../../shared/project';
import {LogManager}    from 'aurelia-framework';
import {Logger}        from 'aurelia-logging';

const logger = <Logger>LogManager.getLogger('gulp-plugin');

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

export class Plugin extends BasePlugin {
  getTiles(project: Project, showIrrelevant) {
    if (!showIrrelevant && !project.isUsingGulp()) {
      return [];
    }

    return [{
      name: 'gulp',
      model: { relevant: project.isUsingGulp() },
      viewModel: 'plugins/gulp/tile'
    }];
  }

  async evaluateProject(project: Project) {
    let lookupPaths = [
      FS.join(project.path, 'gulpfile.js'),
      FS.join(project.path, 'src', 'skeleton', 'gulpfile.js'),
      FS.join(project.path, 'src', 'skeleton-navigation-esnext-vs', 'gulpfile.js'),
      FS.join(project.path, 'src', 'skeleton-navigation-typescript-vs', 'gulpfile.js')
    ];

    if(project.packageJSONPath) {
      lookupPaths.push(FS.join(FS.getFolderPath(project.packageJSONPath), 'gulpfile.js'));
    }

    for (let i = 0; i < lookupPaths.length; i++) {
      if (await FS.fileExists(lookupPaths[i])) {
        project.gulpfile = lookupPaths[i];
        logger.info(`gulp file found: ${project.gulpfile}`);
      }
    };

    if (!project.gulpfile) {
      logger.info(`did not find gulpfile`);
    }
  }

  async getProjectInfoSections(project: Project) {
    if (project.isUsingGulp()) {
      return [{ viewModel: 'plugins/gulp/project-info' }];
    }
    return [];
  }
}