import {Main} from '../../main/main';
import {Project, autoinject} from '../../shared/index';

@autoinject()
export class Screen {
  project: Project;

  constructor(private main: Main) {
  }

  async activate(model) {
    this.project = model.selectedProject;
  }

  goBack() {
    this.main.returnToPluginList();
  }
}
