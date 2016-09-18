import {bindable} from 'aurelia-framework';
import {Command}  from './command';

export class CommandEditor {
  @bindable command: Command;
  @bindable commandStr: string;

  commandChanged() {
    if (!this.command) {
      this.commandStr = '';
    } else {
      this.commandStr = `${this.command.command} ${this.command.args.join(' ')}`.trim();
    }
  }

  commandStrChanged() {
    this.persist();
  }

  persist() {
    if (!this.command) return;

    this.command.command = '';
    this.command.args = [];

    if (this.commandStr.length === 0) {
      return;
    }

    let split = this.commandStr.split(' ');
    this.command.command = split.length > 0 ? split[0] : this.commandStr;

    if (split.length > 1) {
      this.command.args = split.slice(1, split.length);
    }
  }
}