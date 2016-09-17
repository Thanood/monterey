import {Main} from '../../main/main';
import {Project, SelectedProject, autoinject} from '../../shared/index';

@autoinject()
export class Screen {
  tabs: Element;
  activeTab = 'Global';

  constructor(private main: Main,
              private selectedProject: SelectedProject) {}

  attached() {
    $(this.tabs).on('show.bs.tab', (e) => {
      this.activeTab = $(e.target).text();
    });
  }

  goBack() {
    this.main.returnToPluginList();
  }
}
