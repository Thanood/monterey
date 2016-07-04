import {inject} from 'aurelia-framework';
import {Main}   from '../../main/main';
import {useView}   from 'aurelia-framework';

@useView('plugins/default-tile.html')
@inject(Main)
export class Tile {
  constructor(main) {
    this.title = 'App launcher';
    this.main = main;
    this.img = 'images/rocket-icon.png';
  }

  activate(model) {
    this.project = model.project;
  }

  onClick() {
    this.main.activateScreen('plugins/app-launcher/screen');
  }
}
