import {useView, autoinject} from 'aurelia-framework';
import {Main}                from '../../main/main';

@autoinject()
@useView('plugins/default-tile.html')
export class Tile {
  title: string;
  img;
  project;

  constructor(private main: Main) {
    this.title = 'Project info';
    this.img = 'images/list-icon-7901.png';
  }

  activate(model) {
    this.project = model.project;
    Object.assign(this, model.model);
  }

  onClick() {
    this.main.activateScreen('plugins/project-info/screen');
  }
}
