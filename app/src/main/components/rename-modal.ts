import {inject, NewInstance, DialogController, ValidationRules, ValidationController,
  Notification, Project, ApplicationState, SelectedProject} from '../../shared/index';

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
      this.notification.warning('There are validation errors');
      return;
    }

    this.selectedProject.current.name = this.newName;
    await this.state._save();

    this.notification.success('Project name changed');

    this.dialogController.ok();
  }
}
