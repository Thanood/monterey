import {MontereyRegistries, OS, useView, autoinject}  from '../../shared/index';

@autoinject()
@useView('plugins/default-tile.html')
export class Tile {
  title: string;
  img: string;
  tooltip = 'tooltip-gist-run';

  constructor(private registries: MontereyRegistries) {
    this.title = 'GistRun';
    this.img = 'images/gistrun.png';
  }

  async onClick() {
    let registry = await this.registries.getGistRun();

    window.open(registry && registry.latest ? registry.latest : 'https://gist.run/?id=14ac85668b3ca27dcd8ad6d3f6579fb0', '_blank');
  }
}