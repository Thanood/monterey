import {Command}       from '../plugins/task-manager/command';
import {TaskManager}   from '../plugins/task-manager/task-manager';
import {Task}          from '../plugins/task-manager/task';
import {CommandRunner} from '../plugins/task-manager/command-runner';
import {Workflow}      from './workflow';
import {Phase}         from './phase';
import {Step}          from './step';
import {Project}       from '../shared/project';

/**
 * A serializable collection of Commands that can be converted into a Workflow
 */
export class CommandWorkflow {
  command: Command;
  name: string = 'Workflow';
  children: Array<CommandWorkflow> = [];

  constructor(obj: any) {
    Object.assign(this, obj);
  }

  createWorkflow(project: Project, commandRunner: CommandRunner, taskManager: TaskManager) {
    let workflow = new Workflow(taskManager, project);
    let phase = new Phase(this.name);
    workflow.addPhase(phase);

    phase.addStep(this._createStep(this.command, commandRunner, project));

    this._getChildCommands(phase, project, commandRunner, this);

    return workflow;
  }

  _getChildCommands(phase: Phase, project: Project, commandRunner: CommandRunner, commandWorkflow: CommandWorkflow) {
    for (let child of commandWorkflow.children) {
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