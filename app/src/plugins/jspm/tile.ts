import {JSPMDetection} from './jspm-detection';
import {Common}        from './common';
import {Main}          from '../../main/main';
import {Project, Notification, useView, autoinject} from '../../shared/index';

@autoinject()
@useView('plugins/default-tile.html')
export class Tile {
  title: string;
  img: string;
  tooltip = 'tooltip-jspm';
  relevant: boolean;
  project: Project;

  constructor(private main: Main,
              private common: Common,
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
      if (!(await this.common.isJSPMInstalled(this.project))) {
        this.notification.error('Could not find JSPM');
        return;
      }

      this.main.activateScreen('plugins/jspm/screen');
    }
  }
}
