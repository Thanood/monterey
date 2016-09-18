import {bindable} from 'aurelia-framework';
import {Command}  from '../commands/command';

export class Favorites {
  @bindable items = [];
  @bindable start;
  @bindable remove;
  @bindable favoriteCommand;
  newCommand: Command = new Command('');
  addingNew: boolean;

  addFavorite() {
    this.favoriteCommand({ command: this.newCommand });
    this.newCommand = new Command('');
    this.addingNew = false;
  }
}