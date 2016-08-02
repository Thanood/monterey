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
    this.title = 'Gulp';
    this.img = 'images/gulp.png';
  }

  activate(model, relevant) {
    this.project = model.project;
    Object.assign(this, model.model);
  }

  onClick() {
    this.main.activateScreen('plugins/gulp/screen');
  }
}
