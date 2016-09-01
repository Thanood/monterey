import {inject, NewInstance}  from 'aurelia-framework';
import {ValidationRules}      from 'aurelia-validatejs';
import {ValidationController} from 'aurelia-validation';
import {DialogController}     from 'aurelia-dialog';
import {Notification}         from '../../shared/notification';
import {Project}              from '../../shared/project';
import {ApplicationState}     from '../../shared/application-state';
import {SelectedProject}      from '../../shared/selected-project';

@inject(DialogController, NewInstance.of(ValidationController), ApplicationState, SelectedProject, Notification)
export class RenameModal {
  newName: string;
  oldName: string;

  constructor(public dialogController: DialogController,
              public validation: ValidationController,
              public state: ApplicationState,
              public selectedProject: SelectedProject,
              public notification: Notification) {
  }

  bind() {
    this.newName = this.selectedProject.current.name;
    this.oldName = this.selectedProject.current.name;

    new ValidationRules()
      .ensure('newName').presence()
      .on(this);
  }

  async ok() {
    if (this.validation.validate().length > 0) {
      this.notification.error('There are validation errors');
      return;
    }

    this.selectedProject.current.name = this.newName;
    await this.state._save();

    this.notification.success('Project name changed');
    
    this.dialogController.ok();
  }
}
