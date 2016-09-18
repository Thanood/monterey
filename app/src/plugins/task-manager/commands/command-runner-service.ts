import {Task}    from '../../task-manager/index';
import {Command} from './command';
import {Project, autoinject, Container} from '../../../shared/index';

export interface CommandRunnerService {
  title?: string;
  handle(project: Project, command: Command): boolean;
  stopCommand(process): Promise<void>;
  runCommand(project: Project, command: Command, task: Task, stdout, stderr);
  getCommands(project: Project, useCache: boolean): Promise<Array<Command>>;
}