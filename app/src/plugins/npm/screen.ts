import {autoinject}       from 'aurelia-framework';
import {Common}           from './common';
import {DialogService}    from 'aurelia-dialog';
import {TaskManager}      from '../../task-manager/task-manager';
import {TaskManagerModal} from '../../task-manager/task-manager-modal';

@autoinject()
export class Screen {

  model;
  project;

  constructor(private common: Common,
              private dialogService: DialogService) {
  }

  activate(model) {
    this.model = model;
    this.project = model.selectedProject;
    console.log(this.project.packageJSONPath);
  }

  install() {
    let task = this.common.installNPMDependencies(this.project);

    this.dialogService.open({ viewModel: TaskManagerModal, model: { task: task }});
  }
}
