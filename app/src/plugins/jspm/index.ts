import {autoinject}    from 'aurelia-framework';
import {PluginManager} from '../../shared/plugin-manager';
import {Project}       from '../../shared/project';
import {Workflow}      from '../../project-installation/workflow';
import {Step}          from '../../project-installation/step';
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

  async resolvePostInstallWorkflow(project: Project, workflow: Workflow) {
    if (!project.isUsingJSPM()) return;

    let phase = workflow.phases.dependencies;

    if (!phase.stepExists('jspm install')) {
      phase.addStep(new Step('jspm install', 'jspm install', this.common.install(project, true, { lock: true }, true)));
    }

    let jspmInst = phase.getStep('jspm install');
    let npmInst = phase.getStep('npm install');
    if (jspmInst && npmInst && npmInst.order > jspmInst.order) {
      phase.moveAfter(jspmInst, npmInst);
    }
  }
}
