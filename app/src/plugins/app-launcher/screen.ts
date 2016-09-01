import {autoinject}           from 'aurelia-framework';
import {Project}              from '../../shared/project';
import {SelectedProject}      from '../../shared/selected-project';
import {Main}                 from '../../main/main';

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
