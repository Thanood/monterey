import {autoinject, useView}      from 'aurelia-framework';
import {Main}                     from '../../main/main';
import {Detection}                from './detection';
import {SelectedProject, Project} from '../../shared/index';

@useView('plugins/default-tile.html')
@autoinject()
export class Tile {
  title: string;
  img: string;
  tooltip = 'tooltip-webpack';

  constructor(private main: Main,
              private selectedProject: SelectedProject,
              private detection: Detection) {
    this.title = 'Webpack';
    this.img = 'images/webpack.png';
  }

  activate(model) {
    Object.assign(this, model.model);
  }

  async onClick() {
    if (!this.selectedProject.current.isUsingWebpack()) {
      await this.detection.manualDetection(this.selectedProject.current);
    }

    if (this.selectedProject.current.isUsingWebpack()) {
      this.main.activateScreen('plugins/webpack/screen');
    }
  }
}
