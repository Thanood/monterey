import {inject, NewInstance}     from 'aurelia-framework';
import {DialogController}        from 'aurelia-dialog';
import {ApplicationState}        from './application-state';
import {ValidationRules}         from 'aurelia-validatejs';
import {ValidationController}    from 'aurelia-validation';
import {Notification}            from './notification';

@inject(NewInstance.of(ValidationController), DialogController, ApplicationState, Notification)
export class ManageEndpoints {

  tempState = {};

  constructor(private validation: ValidationController,
              private dialog: DialogController,
              private state: ApplicationState,
              private notification: Notification) {}

  attached() {  

    Object.assign(this.tempState, this.state.endpoints);

    ValidationRules
    .ensure('montereyRegistry').required().url()
    .ensure('npmRegistry').required().url()
    .ensure('githubApi').required().url()
    .ensure('github').required().url()
    .on(this.tempState);
  }

  async submit() {
    if (this.validation.validate().length > 0) {
      this.notification.warning('There are validation errors');
      return;
    }

    Object.assign(this.state.endpoints, this.tempState);

    await this.state._save();

    console.log(this.state);

    this.dialog.ok();
  }
}

