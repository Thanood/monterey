import {Command}       from '../task-manager/command';
import {TaskManager}   from '../task-manager/task-manager';
import {Task}          from '../task-manager/task';
import {CommandRunner} from '../task-manager/command-runner';
import {Workflow}      from './workflow';
import {Phase}         from './phase';
import {Step}          from './step';
import {Project}       from '../../shared/project';
import {RandomNumber}  from '../../shared/random-number';

/**
 * A serializable collection of Commands that can be converted into a Workflow
 */
export class CommandTree {
  id?: number;
  command?: Command;
  tile?: boolean;
  name?: string = 'Workflow';
  children?: Array<CommandTree> = [];

  constructor(obj: any) {
    Object.assign(this, obj);

    if (!this.id) {
      this.id = new RandomNumber().create();
      obj.id = this.id;
    }
  }

  createWorkflow(project: Project, commandRunner: CommandRunner, taskManager: TaskManager) {
    let workflow = new Workflow(taskManager, project);
    let phase = new Phase(this.name);
    workflow.addPhase(phase);

    this._addSteps(phase, project, commandRunner, this, null);

    return workflow;
  }

  _addSteps(phase: Phase, project: Project, commandRunner: CommandRunner, tree: CommandTree, parentStep: Step) {
    let step;

    if (tree.command) {
      step = phase.addStep(this._createStep(tree.command, commandRunner, project));

      if (parentStep) {
        step.task.dependsOn = parentStep.task;
      }
    }

    if (tree.children) {
      for (let child of tree.children) {
        this._addSteps(phase, project, commandRunner, child, step);
      }
    }
  }

  _createStep(command: Command, commandRunner: CommandRunner, project: Project) {
    let cmd = `${command.command} ${command.args.join(' ')}`;
    return new Step(cmd, cmd, commandRunner.run(project, command));
  }
}