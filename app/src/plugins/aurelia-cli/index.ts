import {PluginManager} from '../../shared/plugin-manager';
import {BasePlugin}    from '../base-plugin';
import {FS}            from 'monterey-pal';
import {Project}       from '../../shared/project';
import {LogManager}    from 'aurelia-framework';
import {Logger}        from 'aurelia-logging';

const logger = <Logger>LogManager.getLogger('aurelia-cli-plugin');

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
      name: 'aurelia-cli',
      model: { relevant: !!project.aureliaJSONPath },
      viewModel: 'plugins/aurelia-cli/tile'
    }];
  }

  async evaluateProject(project: Project) {
    let lookupPaths = [
      FS.join(project.path, 'aurelia_project', 'aurelia.json')
    ];

    for (let i = 0; i < lookupPaths.length; i++) {
      if (await FS.fileExists(lookupPaths[i])) {
        project.aureliaJSONPath = lookupPaths[i];
        logger.info(`aurelia.json found: ${project.aureliaJSONPath}`);
      }
    };

    if (!project.aureliaJSONPath) {
      logger.info(`did not find aurelia.json file`);
    }
  }

  async getProjectInfoSections(project) {
    if (project.aureliaJSONPath) {
      return [{ viewModel: 'plugins/aurelia-cli/project-info' }];
    }
    return [];
  }
}