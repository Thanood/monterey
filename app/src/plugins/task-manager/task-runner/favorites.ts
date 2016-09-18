import {bindable} from 'aurelia-framework';
import {Favorite} from './task-runner';
import {Command}  from '../commands/command';

export class Favorites {
  @bindable items = [];
  @bindable start;
  @bindable remove;
  @bindable addCustomFavorite;
  newCommand: Command;
  addingNew: boolean;

  addFavorite() {
    this.newCommand = {
      command: '',
      args: []
    };
    this.addingNew = false;
  }
}