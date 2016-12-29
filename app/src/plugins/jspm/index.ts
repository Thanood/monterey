import {Workflow}      from '../workflow/workflow';
import {Step}          from '../workflow/step';
import {Task}          from '../task-manager/index';
import {BasePlugin}    from '../base-plugin';
import {JSPMDetection} from './jspm-detection';
import {Common}        from './common';
import {PluginManager, Project, autoinject} from '../../shared/index';

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

    return project;
  }

  async getProjectInfoSections(project: Project) {
    if (project.isUsingJSPM()) {
      return [{ viewModel: 'plugins/jspm/project-info' }];
    }
    return [];
  }

  async resolvePostInstallWorkflow(project: Project, workflow: Workflow) {
    if (!project.isUsingJSPM()) return;

    let phase = workflow.getPhase('dependencies');

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
