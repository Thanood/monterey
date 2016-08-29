import {autoinject}    from 'aurelia-framework';
import {Project}       from '../../shared/project';
import {PluginManager} from '../../shared/plugin-manager';
import {Workflow}      from '../../project-installation/workflow';
import {Step}          from '../../project-installation/step';
import {Task}          from '../task-manager/task';
import {NPMDetection}  from './npm-detection';
import {BasePlugin}    from '../base-plugin';
import {Common}        from './common';

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

@autoinject()
export class Plugin extends BasePlugin {

  constructor(private common: Common,
              private npmDetection: NPMDetection) {
    super();
  }

  getTiles(project: Project, showIrrelevant: boolean) {
    if (!showIrrelevant && !project.isUsingNPM()) {
      return [];
    }

    return [{
      name: 'npm',
      model: { relevant: project.isUsingNPM() },
      viewModel: 'plugins/npm/tile'
    }];
  }

  async evaluateProject(project: Project) {
    await this.npmDetection.findPackageJSON(project);
  }

  async getProjectInfoSections(project: Project) {
    if (project.isUsingNPM()) {
      return [{ viewModel: 'plugins/npm/project-info' }];
    }
    return [];
  }

  async resolvePostInstallWorkflow(project: Project, workflow: Workflow) {
    if (!project.isUsingNPM()) return;

    if (!workflow.phases.dependencies.stepExists('npm install')) {
      workflow.phases.dependencies.addStep(new Step('npm install', 'npm install', this.common.installNPMDependencies(project)));
    }
  }
}
