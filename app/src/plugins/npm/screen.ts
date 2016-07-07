import {autoinject}  from 'aurelia-framework';
import {Common}      from './common';

@autoinject()
export class Screen {

  model;
  project;

  constructor(private common: Common) {
  }

  activate(model) {
    this.model = model;
    this.project = model.selectedProject;
    console.log(this.project.packageJSONPath);
  }

  install() {
    this.common.installNPMDependencies(this.project);
  }
}
