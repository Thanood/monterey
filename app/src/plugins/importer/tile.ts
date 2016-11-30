import {useView, autoinject} from 'aurelia-framework';
import {Main}                from '../../main/main';

@autoinject()
@useView('plugins/default-tile.html')
export class Tile {
 title: string;
 img: string;
 tooltip = 'tooltip-importer';

 constructor(private main: Main) {
   this.title = 'Importer';
   this.img = 'images/importer.png';
 }

 activate(model) {
    Object.assign(this, model.model);
  }

 async onClick() {
    this.main.activateScreen('plugins/importer/screen');
  }
}