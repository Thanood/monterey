import {useView, autoinject} from 'aurelia-framework';
import {Main}                from '../../main/main';

@autoinject()
@useView('plugins/default-tile.html')
export class Tile {
  title: string;
  img: string;
  project;

  constructor(private main: Main) {
    this.title = 'JSPM';
    this.img = 'images/jspm.png';
  }

  activate(model) {
    this.project = model.project;
  }

  onClick() {
    this.main.activateScreen('plugins/jspm/screen');
  }
}
