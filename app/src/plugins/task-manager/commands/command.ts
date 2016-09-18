import {CommandRunnerService} from './command-runner-service';

export class Command {
  id?: number;

  constructor(public command?: string,
              public args: Array<string> = [],
              public description?: string) {}

  fromObject(obj: any) {
    Object.assign(this, obj);
    return this;
  }

  get displayName() {
    if (this.description) {
      return this.description;
    }
    return this.command + ' ' + this.args.join(' ');
  }
}