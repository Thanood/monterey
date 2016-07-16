import {useView}            from 'aurelia-framework';

@useView('plugins/default-tile.html')
export class Tile {
  title: string;
  img: string;

  constructor() {
    this.title = 'Support';
    this.img = 'images/support.png';
  }

  async onClick() {
    window.open('https://github.com/monterey-framework/monterey/issues', '_blank');
  }
}