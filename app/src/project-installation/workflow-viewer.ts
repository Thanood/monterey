import {autoinject, bindable}    from 'aurelia-framework';
import {TaskManager}   from '../plugins/task-manager/task-manager';
import {Task}          from '../plugins/task-manager/task';
import {Workflow}      from '../project-installation/workflow';
import {Step}          from '../project-installation/step';
import {Phase}         from '../project-installation/phase';
import {PluginManager} from '../shared/plugin-manager';
import {Project}       from '../shared/project';

@autoinject()
export class WorkflowViewer {
  @bindable project: Project;
  workflow: Workflow;

  constructor(private pluginManager: PluginManager,
              private taskManager: TaskManager) {}

  attached() {
    this.resolveWorkflow();
  }

  async resolveWorkflow() {
    let workflow = new Workflow(this.taskManager, this.project);
    workflow.addPhase(new Phase('dependencies', 'install dependencies'));
    workflow.addPhase(new Phase('environment', 'setup the environment'));
    workflow.addPhase(new Phase('run', 'start the project'));

    await this.pluginManager.resolvePostInstallWorkflow(this.project, workflow);

    this.workflow = workflow;
  }
}