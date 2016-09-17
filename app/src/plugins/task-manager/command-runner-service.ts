import {autoinject, Container}               from 'aurelia-framework';
import {Project}                             from '../../shared/project';
import {Task}                                from '../task-manager/task';
import {Command}                             from './command';

export interface CommandRunnerService {
  title?: string;
  handle(project: Project, command: Command): boolean;
  stopCommand(process): Promise<void>;
  runCommand(project: Project, command: Command, task: Task, stdout, stderr);
  getCommands(project: Project, useCache: boolean): Promise<Array<Command>>;
}