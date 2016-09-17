import {Task, TaskManager} from '../task-manager/index';
import {Workflow}          from './workflow';
import {Step}              from './step';
import {Phase}             from './phase';
import {PluginManager, Project, autoinject, bindable} from '../../shared/index';

@autoinject()
export class WorkflowViewer {
  @bindable project: Project;
  @bindable checkedCount: number;
  @bindable selectedTasks: Array<any>;
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

    this.updateSelectedTasksArray();
  }

  onCheck(phase, step) {
    this.workflow.onCheck(phase, step);
    this.updateSelectedTasksArray();
  }

  updateSelectedTasksArray() {
    this.selectedTasks = this.workflow.getSelectedTasks();
    this.checkedCount = this.selectedTasks.length;
  }

  async start() {
    return await this.workflow.start();
  }
}