import {autoinject, LogManager} from 'aurelia-framework';
import {Logger}              from 'aurelia-logging';
import {FS}                  from 'monterey-pal';
import {BasePlugin}          from '../base-plugin';
import {AureliaCLIDetection} from './aurelia-cli-detection';
import {PluginManager}       from '../../shared/plugin-manager';
import {Project}             from '../../shared/project';

const logger = <Logger>LogManager.getLogger('aurelia-cli-plugin');

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

@autoinject()
export class Plugin extends BasePlugin {
  constructor(private aureliaCLIDetection: AureliaCLIDetection) {
    super();
  }

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
    await this.aureliaCLIDetection.findAureliaJSONConfig(project);
  }

  async getProjectInfoSections(project) {
    if (project.aureliaJSONPath) {
      return [{ viewModel: 'plugins/aurelia-cli/project-info' }];
    }
    return [];
  }
}