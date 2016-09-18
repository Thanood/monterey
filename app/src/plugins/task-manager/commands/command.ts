import {CommandRunnerService} from './command-runner-service';

export interface Command {
  id?: number;
  description?: string;
  command: string;
  args: Array<string>;
  service?: CommandRunnerService;
}