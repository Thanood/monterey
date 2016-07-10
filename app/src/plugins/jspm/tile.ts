import {useView, autoinject} from 'aurelia-framework';
import {Main}                from '../../main/main';
import {JSPMDetection}       from './jspm-detection';
import {ApplicationState}    from '../../shared/application-state';

@autoinject()
@useView('plugins/default-tile.html')
export class Tile {
  title: string;
  img: string;
  relevant: boolean;
  project;

  constructor(private main: Main,
              private state: ApplicationState,
              private jspmDetection: JSPMDetection) {
    this.title = 'JSPM';
    this.img = 'images/jspm.png';
  }

  activate(model) {
    Object.assign(this, model.model);
  }

  async onClick() {
    if (this.relevant) {
      this.main.activateScreen('plugins/jspm/screen');
    } else {
      try {
        await this.jspmDetection.findJspmConfig(this.project);
        if (this.project.isUsingJSPM) {
          await this.state._save();
          this.main.activateScreen('plugins/jspm/screen');
        } else {
          alert('Unable to detect JSPM');
        }
      } catch (error) {
        alert(`Error during the detection of JSPM: ${error.message}`);
      }
    }
  }
}
