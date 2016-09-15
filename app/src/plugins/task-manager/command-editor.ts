import {bindable} from 'aurelia-framework';
import {Command}  from './command';

export class CommandEditor {
  @bindable command: Command;
  @bindable argsString: string;

  commandChanged() {
    this.argsString = this.command ? this.command.args.join(' ') : '';
  }

  argsStringChanged() {
    this.command.args = this.argsString.split(' ');
  }
}