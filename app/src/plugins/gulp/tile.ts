import {autoinject, useView} from 'aurelia-framework';
import {Main}                from '../../main/main';
import {Project}             from '../../shared/project';
import {GulpDetection}       from './gulp-detection';

@useView('plugins/default-tile.html')
@autoinject()
export class Tile {
  title: string;
  img: string;
  project: Project;

  constructor(private main: Main,
              private gulpDetection: GulpDetection) {
    this.title = 'Gulp';
    this.img = 'images/gulp.png';
  }

  activate(model) {
    this.project = model.project;
    Object.assign(this, model.model);
  }

  async onClick() {
    if (!this.project.isUsingGulp()) {
      await this.gulpDetection.manualDetection(this.project);
    }
    
    if (this.project.isUsingGulp()) {
      this.main.activateScreen('plugins/gulp/screen');
    }
  }
}
