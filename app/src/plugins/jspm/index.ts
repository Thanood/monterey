import {autoinject}    from 'aurelia-framework';
import {PluginManager} from '../../shared/plugin-manager';
import {Project}       from '../../shared/project';
import {Task}          from '../task-manager/task';
import {BasePlugin}    from '../base-plugin';
import {JSPMDetection} from './jspm-detection';
import {Common}        from './common';

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

@autoinject()
export class Plugin extends BasePlugin {
  constructor(private jspmDetection: JSPMDetection,
              private common: Common) {
    super();
  }

  getTiles(project: Project, showIrrelevant) {
    if (!showIrrelevant && !project.isUsingJSPM()) {
      return [];
    }

    return [{
      name: 'jspm',
      viewModel: 'plugins/jspm/tile',
      model: { relevant: project.isUsingJSPM(), project: project }
    }];
  }

  async evaluateProject(project: Project) {
    if (project.packageJSONPath) {
      await this.jspmDetection.findJspmConfig(project);
    }
  }

  async getProjectInfoSections(project: Project) {
    if (project.isUsingJSPM()) {
      return [{ viewModel: 'plugins/jspm/project-info' }];
    }
    return [];
  }

  async getPostInstallTasks(project: Project): Promise<Array<Task>> {
    if (project.isUsingJSPM()) {
      return [
        this.common.install(project, true, { lock: true }, true)
      ];
    }
  }
}
