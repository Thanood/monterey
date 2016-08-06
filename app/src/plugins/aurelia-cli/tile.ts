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
    this.title = 'Aurelia-CLI';
    this.img = 'images/aurelia-icon-128x128.png';
  }

  activate(model) {
    this.project = model.project;
    Object.assign(this, model.model);
  }

  onClick() {
    this.main.activateScreen('plugins/aurelia-cli/screen');
  }
}
