import {bindable} from 'aurelia-framework';
import {Favorite} from './task-runner';
import {Command}  from '../commands/command';

export class Favorites {
  @bindable items = [];
  @bindable start;
  @bindable remove;
  @bindable favoriteCommand;
  newCommand: Command = {
    command: '',
    args: []
  };
  addingNew: boolean;

  addFavorite() {
    this.favoriteCommand({ command: this.newCommand });
    this.newCommand = {
      command: '',
      args: []
    };
    this.addingNew = false;
  }
}