import {useView} from 'aurelia-framework';

@useView('plugins/default-tile.html')
export class Tile {
 title: string;
 img: string;

 constructor() {
   this.title = 'Layout';
   this.img = 'http://icons.iconarchive.com/icons/custom-icon-design/flatastic-8/72/Layout-icon.png';
 }

 async onClick() {
   alert('Layout manager responding');
 }
}