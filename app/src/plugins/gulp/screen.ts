import {Project}          from '../../shared/project';
import {autoinject}       from 'aurelia-framework';
import {Main}             from '../../main/main';

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
