import {Command}     from '../plugins/task-manager/command';
import {TaskManager} from '../plugins/task-manager/task-manager';
import {Task}        from '../plugins/task-manager/task';
import {Workflow}    from './workflow';
import {Phase}       from './phase';
import {Step}        from './step';
import {Project}     from '../shared/project';

export class CommandWorkflow {
  command: Command;
  name: string = 'Workflow';
  children: Array<CommandWorkflow> = [];

  constructor(obj: any) {
    Object.assign(this, obj);
  }

  createWorkflow(project: Project, taskManager: TaskManager) {
    let workflow = new Workflow(taskManager, project);
    let phase = new Phase(this.name);
    workflow.addPhase(phase);

    phase.addStep(this._createStep(this.command, project));

    this._getChildCommands(phase, project, this);

    return workflow;
  }

  _getChildCommands(phase: Phase, project: Project, commandWorkflow: CommandWorkflow) {
    for (let child of commandWorkflow.children) {
      phase.addStep(this._createStep(child.command, project));

      if (child.children.length > 0) {
        this._getChildCommands(phase, project, child);
      }
    }
  }

  _createStep(command: Command, project: Project) {
    let cmd = `${command.command} ${command.args.join(' ')}`;
    return new Step(cmd, cmd, new Task(project, cmd).fromCommand(command));
  }
}