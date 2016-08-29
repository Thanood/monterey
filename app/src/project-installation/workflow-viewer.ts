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
  @bindable checkedCount: number;
  @bindable selectedTasks: Array<Task> = [];
  phases: Array<Phase> = [];

  constructor(private pluginManager: PluginManager,
              private taskManager: TaskManager) {}

  attached() {
    this.resolveWorkflow();
  }

  async resolveWorkflow() {
    let workflow = new Workflow();
    
    await this.pluginManager.resolvePostInstallWorkflow(this.project, workflow);

    this.workflow = workflow;

    this.setPhases();

    this.selectedTasks = this.getSelectedTasks();
    this.checkedCount = this.selectedTasks.length;
  }

  setPhases() {
    this.phases = [
      this.workflow.phases.dependencies,
      this.workflow.phases.environment,
      this.workflow.phases.run
    ];
  }

  onCheck(phase: Phase, step?: Step) {
    let index = this.phases.indexOf(phase);

    // deselect following phases and steps
    if ((step && !step.checked) || !phase.checked) {
      // following phases
      for(let x = index + 1; x < this.phases.length; x++) {
        this.phases[x].checked = false;
        this.phases[x].steps.forEach(s => s.checked = false);
      }

      // steps in same phase
      if (step) {
        let stepIndex = phase.steps.indexOf(step);
        for(let x = stepIndex + 1; x < phase.steps.length; x++) {
          phase.steps[x].checked = false;
        }
      } else {
        phase.steps.forEach(s => s.checked = false);
      }
    }

    
    if ((step && step.checked) || phase.checked) {
      for(let x = 0; x < index; x++) {
        this.phases[x].checked = true;
        this.phases[x].steps.forEach(s => s.checked = true);
      }

      if (!step) {
        phase.steps.forEach(s => s.checked = true);
      } else {
        let stepIndex = phase.steps.indexOf(step);
        for(let x = 0; x < stepIndex; x++) {
          phase.steps[x].checked = true;
        }
      }
    }

    phase.checked = phase.steps.filter(x => x.checked).length > 0;

    this.selectedTasks = this.getSelectedTasks();
    this.checkedCount = this.selectedTasks.length;
  }

  getSelectedTasks() {
    let tasks = [];
    this.phases.forEach(phase => {
      phase.steps.forEach(step => {
        if (step.checked) {
          tasks.push(step.task);
        }
      });
    });
    return tasks;
  }

  start() {
    let tasks: Array<Task> = this.getSelectedTasks();

    if (tasks.length === 0) {
      return [];
    }

    let prevTask;
    tasks.forEach(task => {
      if (prevTask) {
        task.dependsOn = prevTask;
      }
      this.taskManager.addTask(this.project, task);
      prevTask = task;
    });

    this.taskManager.startTask(tasks[0]);

    return tasks;
  }
}