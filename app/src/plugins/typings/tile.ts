import {Main}      from '../../main/main';
import {Detection} from './detection';
import {SelectedProject, autoinject, useView} from '../../shared/index';

@useView('plugins/default-tile.html')
@autoinject()
export class Tile {
  title: string;
  img: string;
  tooltip = 'tooltip-typings';

  constructor(private main: Main,
              private selectedProject: SelectedProject,
              private detection: Detection) {
    this.title = 'Typings';
    this.img = 'images/typings.png';
  }

  activate(model) {
    Object.assign(this, model.model);
  }

  async onClick() {
    if (!this.selectedProject.current.isUsingTypings()) {
      await this.detection.manualDetection(this.selectedProject.current);
    }

    if (this.selectedProject.current.isUsingTypings()) {
      this.main.activateScreen('plugins/typings/screen');
    }
  }
}
