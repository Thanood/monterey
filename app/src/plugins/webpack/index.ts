import {autoinject}       from 'aurelia-framework';
import {PluginManager}    from '../../shared/plugin-manager';
import {Detection}        from './detection';
import {BasePlugin}       from '../base-plugin';
import {Project}          from '../../shared/project';

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

@autoinject()
export class Plugin extends BasePlugin {
  constructor(private detection: Detection) {
    super();
  }

  getTiles(project: Project, showIrrelevant) {
    if (!showIrrelevant && !project.isUsingWebpack()) {
      return [];
    }

    return [{
      name: 'webpack',
      model: { relevant: !!project.isUsingWebpack() },
      viewModel: 'plugins/webpack/tile'
    }];
  }

  async evaluateProject(project: Project) {
    await this.detection.findWebpackConfig(project);
  }

  async getProjectInfoSections(project: Project) {
    if (project.isUsingWebpack()) {
      return [{ viewModel: 'plugins/webpack/project-info' }];
    }
    return [];
  }
}