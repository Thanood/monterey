import {SelectedProject, autoinject} from '../../shared/index';
import {Main} from '../../main/main';

@autoinject()
export class Screen {

  constructor(private main: Main,
              private selectedProject: SelectedProject) {
  }

  goBack() {
    this.main.returnToPluginList();
  }
}
