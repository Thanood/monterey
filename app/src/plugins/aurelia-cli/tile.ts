import {autoinject, useView} from 'aurelia-framework';
import {Main}                from '../../main/main';
import {Detection}           from './detection';
import {Project}             from '../../shared/project';

@useView('plugins/default-tile.html')
@autoinject()
export class Tile {
  title: string;
  img: string;
  project: Project;

  constructor(private main: Main,
              private detection: Detection) {
    this.title = 'Aurelia-CLI';
    this.img = 'images/aurelia-icon-128x128.png';
  }

  activate(model) {
    this.project = model.project;
    Object.assign(this, model.model);
  }

  async onClick() {
    if (!this.project.isUsingAureliaCLI()) {
      await this.detection.manualDetection(this.project);
    }
    
    if (this.project.isUsingAureliaCLI()) {
      this.main.activateScreen('plugins/aurelia-cli/screen');
    }
  }
}
