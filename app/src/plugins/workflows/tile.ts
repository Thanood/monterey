import {autoinject, useView} from 'aurelia-framework';
import {Main}                from '../../main/main';
import {SelectedProject}     from '../../shared/selected-project';

@useView('plugins/default-tile.html')
@autoinject()
export class Tile {
  title: string;
  img: string;
  running: boolean;

  constructor(private main: Main,
              private selectedProject: SelectedProject) {
    this.img = 'images/play.png';
  }

  activate(model) {
    Object.assign(this, model.model);
  }

  async onClick() {
    this.running = !this.running;

    this.img = this.running ? 'images/stop.png' : 'images/play.png';
  }
}
