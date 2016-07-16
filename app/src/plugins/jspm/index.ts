import {PluginManager} from '../../shared/plugin-manager';
import {BasePlugin}    from '../base-plugin';
import {JSPMDetection} from './jspm-detection';
import {autoinject}    from 'aurelia-framework';

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

@autoinject()
class Plugin extends BasePlugin {
  constructor(private jspmDetection: JSPMDetection) {
    super();
  }

  getTiles(project, showIrrelevant) {
    if (!showIrrelevant && !project.isUsingJSPM) {
      return [];
    }

    return [{
      viewModel: 'plugins/jspm/tile',
      model: { relevant: project.isUsingJSPM, project: project }
    }];
  }

  async evaluateProject(project) {
    if (project.packageJSONPath) {
      await this.jspmDetection.findJspmConfig(project);
    }
  }

  async getProjectInfoSections(project) {
    if (project.isUsingJSPM) {
      return [{ viewModel: 'plugins/jspm/project-info' }];
    }
    return [];
  }
}
