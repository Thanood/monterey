import {autoinject, useView} from 'aurelia-framework';
import {Main}                from '../../main/main';
import {Project}             from '../../shared/project';
import {SelectedProject}     from '../../shared/selected-project';
import {Detection}           from './detection';

@useView('plugins/default-tile.html')
@autoinject()
export class Tile {
  title: string;
  img: string;

  constructor(private main: Main,
              private selectedProject: SelectedProject,
              private detection: Detection) {
    this.title = 'Gulp';
    this.img = 'images/gulp.png';
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
