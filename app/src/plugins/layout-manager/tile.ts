import {useView, autoinject} from 'aurelia-framework';
import {Main}                from '../../main/main';

@autoinject()
@useView('plugins/default-tile.html')
export class Tile {
 title: string;
 img: string;
 tooltip = 'tooltip-layout-manager';

 constructor(private main: Main) {
   this.title = 'Layout';
   this.img = 'http://icons.iconarchive.com/icons/custom-icon-design/flatastic-8/72/Layout-icon.png';
 }

 activate(model) {
    Object.assign(this, model.model);
  }

 async onClick() {
    this.main.activateScreen('plugins/layout-manager/screen');
  }
}