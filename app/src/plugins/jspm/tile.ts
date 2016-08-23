import {useView, autoinject} from 'aurelia-framework';
import {JSPMDetection}       from './jspm-detection';
import {Project}             from '../../shared/project';
import {Main}                from '../../main/main';
import {Notification}        from '../../shared/notification';

@autoinject()
@useView('plugins/default-tile.html')
export class Tile {
  title: string;
  img: string;
  relevant: boolean;
  project: Project;

  constructor(private main: Main,
              private jspmDetection: JSPMDetection,
              private notification: Notification) {
    this.title = 'JSPM';
    this.img = 'images/jspm.png';
  }

  activate(model) {
    Object.assign(this, model.model);
  }

  async onClick() {
    if (!this.project.isUsingJSPM()) {
      await this.jspmDetection.manualDetection(this.project);
    }
    
    if (this.project.isUsingJSPM()) {
      this.main.activateScreen('plugins/jspm/screen');
    }
  }
}
