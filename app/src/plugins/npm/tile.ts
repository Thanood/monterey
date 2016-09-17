import {Main}         from '../../main/main';
import {NPMDetection} from './npm-detection';
import {Project, SelectedProject, useView, autoinject} from '../../shared/index';

@autoinject()
@useView('plugins/default-tile.html')
export class Tile {
  title: string;
  img: string;
  tooltip = 'tooltip-npm';

  constructor(private main: Main,
              private selectedProject: SelectedProject,
              private npmDetection: NPMDetection) {
    this.title = 'NPM';
    this.img = 'images/npm-256-square.png';
  }

  activate(model) {
    Object.assign(this, model.model);
  }

  async onClick() {
    if (!this.selectedProject.current.isUsingNPM()) {
      await this.npmDetection.manualDetection(this.selectedProject.current);
    }

    if (this.selectedProject.current.isUsingNPM()) {
      this.main.activateScreen('plugins/npm/screen');
    }
  }
}
