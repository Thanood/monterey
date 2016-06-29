import {useView, inject} from 'aurelia-framework';
import {Main}            from '../../main/main';

@inject(Main)
@useView('plugins/default-tile.html')
export class Tile {
  constructor(main) {
    this.title = 'NPM';
    this.main = main;
  }

  activate(model) {
    this.project = model.project;
  }

  onClick() {
    this.main.activateScreen('plugins/npm/screen');
  }
}
