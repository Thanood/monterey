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
  id: number;
  command: Command;
  name: string = 'Workflow';
  children: Array<CommandTree> = [];

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

    phase.addStep(this._createStep(this.command, commandRunner, project));

    this._getChildCommands(phase, project, commandRunner, this);

    return workflow;
  }

  _getChildCommands(phase: Phase, project: Project, commandRunner: CommandRunner, tree: CommandTree) {
    for (let child of tree.children) {
      phase.addStep(this._createStep(child.command, commandRunner, project));

      if (child.children.length > 0) {
        this._getChildCommands(phase, project, commandRunner, child);
      }
    }
  }

  _createStep(command: Command, commandRunner: CommandRunner, project: Project) {
    let cmd = `${command.command} ${command.args.join(' ')}`;
    return new Step(cmd, cmd, commandRunner.run(project, command));
  }
}