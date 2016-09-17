import {Main}      from '../../main/main';
import {Detection} from './detection';
import {Project, SelectedProject, autoinject, useView} from '../../shared/index';

@useView('plugins/default-tile.html')
@autoinject()
export class Tile {
  title: string;
  img: string;
  tooltip = 'tooltip-gulp';

  constructor(private main: Main,
              private selectedProject: SelectedProject,
              private detection: Detection) {
    this.title = 'Gulp';
    this.img = 'images/gulp-transparent.png';
  }

  activate(model) {
    Object.assign(this, model.model);
  }

  async onClick() {
    if (!this.selectedProject.current.isUsingGulp()) {
      await this.detection.manualDetection(this.selectedProject.current);
    }

    if (this.selectedProject.current.isUsingGulp()) {
      this.main.activateScreen('plugins/gulp/screen');
    }
  }
}
