import {autoinject}           from 'aurelia-framework';
import {Project}              from '../../shared/project';
import {Main}                 from '../../main/main';

@autoinject()
export class Screen {
  model;
  project: Project;
  tabs: Element;
  activeTab = 'Global';

  constructor(private main: Main) {}

  activate(model) {
    this.model = model;
    this.project = model.selectedProject;
  }

  attached() {
    $(this.tabs).on('show.bs.tab', (e) => {
      this.activeTab = $(e.target).text();
    });
  }

  goBack() {
    this.main.returnToPluginList();
  }
}
