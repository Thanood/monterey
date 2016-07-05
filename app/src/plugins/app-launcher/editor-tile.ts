import {autoinject} from 'aurelia-framework';
import {Main}       from '../../main/main';
import {useView}    from 'aurelia-framework';

@useView('plugins/default-tile.html')
@autoinject()
export class Tile {
  title: string;
  img: string;
  project;

  constructor(private main: Main) {
    this.title = 'App launcher';
    this.img = 'images/rocket-icon.png';
  }

  activate(model, relevant) {
    this.project = model.project;
    Object.assign(this, model.model);
  }

  onClick() {
    this.main.activateScreen('plugins/app-launcher/screen');
  }
}
