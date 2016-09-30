import {inject, NewInstance}     from 'aurelia-framework';
import {DialogController}        from 'aurelia-dialog';
import {ApplicationState}        from './application-state';
import {ValidationRules}         from 'aurelia-validatejs';
import {ValidationController}    from 'aurelia-validation';
import {Notification}            from '../shared/notification';

@inject(NewInstance.of(ValidationController), DialogController, ApplicationState, Notification)
export class GithubCreds {
  username: string;
  password: string;

  constructor(public validation: ValidationController,
              private dialog: DialogController,
              private state: ApplicationState,
              private notification: Notification) {}

  attached() {
    ValidationRules
    .ensure('username').required()
    .ensure('password').required()
    .on(this);
  }

  submit() {
    if (this.validation.validate().length > 0) {
      this.notification.warning('There are validation errors');
      return;
    }

    this.state.gitAuthorization = btoa(`${this.username}:${this.password}`);

    this.state._save();

    this.dialog.ok();
  }
}

