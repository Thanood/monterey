import {useView, autoinject} from 'aurelia-framework';
import {Main}                from '../../main/main';
import {Project}             from '../../shared/project';
import {NPMDetection}        from './npm-detection';

@autoinject()
@useView('plugins/default-tile.html')
export class Tile {
  title: string;
  img: string;
  project: Project;

  constructor(private main: Main,
              private npmDetection: NPMDetection) {
    this.title = 'NPM';
    this.img = 'images/npm-256-square.png';
  }

  activate(model) {
    this.project = model.project;
    Object.assign(this, model.model);
  }

  async onClick() {
    if (!this.project.isUsingNPM()) {
      await this.npmDetection.manualDetection(this.project);
    }
    
    if (this.project.isUsingNPM()) {
      this.main.activateScreen('plugins/npm/screen');
    }
  }
}
