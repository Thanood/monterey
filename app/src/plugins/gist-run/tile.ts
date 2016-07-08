import {useView} from 'aurelia-framework';

@useView('plugins/default-tile.html')
export class Tile {
  title: string;
  img: string;

  constructor() {
    this.title = 'GistRun';
    this.img = 'images/gistrun.png';
  }

  onClick() {
    // TODO: should be getting this url from the registry: https://github.com/monterey-framework/registries/blob/master/gistrun.json#L2
    window.open('https://gist.run/?id=14ac85668b3ca27dcd8ad6d3f6579fb0', '_blank');
  }
}