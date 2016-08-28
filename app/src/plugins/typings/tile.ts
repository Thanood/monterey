import {autoinject, useView} from 'aurelia-framework';
import {Main}                from '../../main/main';
import {Project}             from '../../shared/project';
import {Detection}           from './detection';

@useView('plugins/default-tile.html')
@autoinject()
export class Tile {
  title: string;
  img: string;
  project: Project;

  constructor(private main: Main,
              private detection: Detection) {
    this.title = 'Typings';
    this.img = 'images/typings.png';
  }

  activate(model) {
    this.project = model.project;
    Object.assign(this, model.model);
  }

  async onClick() {
    if (!this.project.isUsingTypings()) {
      await this.detection.manualDetection(this.project);
    }
    
    if (this.project.isUsingTypings()) {
      this.main.activateScreen('plugins/typings/screen');
    }
  }
}
