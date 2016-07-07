import {useView, autoinject} from 'aurelia-framework';
import {Main}                from '../../main/main';

@autoinject()
@useView('plugins/default-tile.html')
export class Tile {
  title: string;
  img: string;

  constructor(private main: Main) {
    this.title = 'Preferences';
    this.img = 'images/preferences.png';
  }

  onClick() {
    this.main.activateScreen('plugins/preferences/screen');
  }
}
