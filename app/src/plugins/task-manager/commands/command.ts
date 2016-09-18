import {CommandRunnerService} from './command-runner-service';

export class Command {
  id?: number;

  constructor(public command: string,
              public args: Array<string> = [],
              public description?: string) {}

  get displayName() {
    if (this.description) {
      return this.description;
    }
    return this.command + ' ' + this.args.join(' ');
  }
}