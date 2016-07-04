import {useView, inject} from 'aurelia-framework';
import {Main}            from '../../main/main';

@inject(Main)
@useView('plugins/default-tile.html')
export class Tile {
  constructor(main) {
    this.title = 'Project info';
    this.main = main;
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
