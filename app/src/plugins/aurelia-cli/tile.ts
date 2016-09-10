import {autoinject, useView} from 'aurelia-framework';
import {Main}                from '../../main/main';
import {Detection}           from './detection';
import {SelectedProject}     from '../../shared/selected-project';

@useView('plugins/default-tile.html')
@autoinject()
export class Tile {
  title: string;
  img: string;

  constructor(private main: Main,
              private selectedProject: SelectedProject,
              private detection: Detection) {
    this.title = 'Aurelia-CLI';
    this.img = 'images/aurelia-icon-128x128.png';
  }

  activate(model) {
    Object.assign(this, model.model);
  }

  async onClick() {
    if (!this.selectedProject.current.isUsingAureliaCLI()) {
      await this.detection.manualDetection(this.selectedProject.current);
    }

    if (this.selectedProject.current.isUsingAureliaCLI()) {
      this.main.activateScreen('plugins/aurelia-cli/screen');
    }
  }
}
