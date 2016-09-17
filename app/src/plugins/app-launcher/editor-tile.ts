import {autoinject, useView} from 'aurelia-framework';
import {Main}                from '../../main/main';

@useView('plugins/default-tile.html')
@autoinject()
export class Tile {
  title: string;
  img: string;
  tooltip = 'tooltip-app-launcher';

  constructor(private main: Main) {
    this.title = 'App launcher';
    this.img = 'images/rocket-icon.png';
  }

  activate(model, relevant) {
    Object.assign(this, model.model);
  }

  onClick() {
    this.main.activateScreen('plugins/app-launcher/screen');
  }
}
