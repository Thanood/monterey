import {autoinject, useView} from 'aurelia-framework';
import {Main}                from '../../main/main';
import {Project}             from '../../shared/project';
import {WebpackDetection}    from './webpack-detection';

@useView('plugins/default-tile.html')
@autoinject()
export class Tile {
  title: string;
  img: string;
  project: Project;

  constructor(private main: Main,
              private webpackDetection: WebpackDetection) {
    this.title = 'Webpack';
    this.img = 'images/webpack.png';
  }

  activate(model) {
    this.project = model.project;
    Object.assign(this, model.model);
  }

  async onClick() {
    if (!this.project.isUsingWebpack()) {
      await this.webpackDetection.manualDetection(this.project);
    }
    
    if (this.project.isUsingWebpack()) {
      this.main.activateScreen('plugins/webpack/screen');
    }
  }
}
