import {Step}        from './step';
import {Phase}       from './phase';
import {Task}        from '../plugins/task-manager/task';
import {TaskManager} from '../plugins/task-manager/task-manager';
import {Project}     from '../shared/project';

/**
 * A workflow is a combination of tasks. A task can run a command (gulp watch) or call an API (jspm's install api)
 */
export class Workflow {
  phases: Array<Phase> = [];

  constructor(private taskManager: TaskManager,
              private project: Project)
  {}

  addPhase(phase: Phase) {
    if (!this.getPhase(phase.identifier)) {
      this.phases.push(phase);
    }
  }

  getPhase(name: string) {
    return this.phases.find(x => x.identifier === name);
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

    tasks.forEach(task => {
      this.taskManager.addTask(this.project, task);
    });

    this.taskManager.startTask(tasks[0]);

    return tasks;
  }

  onCheck(phase: Phase, step?: Step) {
    let index = this.phases.indexOf(phase);

    // deselect following phases and steps
    if ((step && !step.checked) || !phase.checked) {
      // following phases
      for (let x = index + 1; x < this.phases.length; x++) {
        this.phases[x].checked = false;
        this.phases[x].steps.forEach(s => s.checked = false);
      }

      // steps in same phase
      if (step) {
        let stepIndex = phase.steps.indexOf(step);
        for (let x = stepIndex + 1; x < phase.steps.length; x++) {
          phase.steps[x].checked = false;
        }
      } else {
        phase.steps.forEach(s => s.checked = false);
      }
    }


    if ((step && step.checked) || phase.checked) {
      for (let x = 0; x < index; x++) {
        this.phases[x].checked = true;
        this.phases[x].steps.forEach(s => s.checked = true);
      }

      if (!step) {
        phase.steps.forEach(s => s.checked = true);
      } else {
        let stepIndex = phase.steps.indexOf(step);
        for (let x = 0; x < stepIndex; x++) {
          phase.steps[x].checked = true;
        }
      }
    }

    phase.checked = phase.steps.filter(x => x.checked).length > 0;
  }
}

