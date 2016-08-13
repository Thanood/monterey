import {inject, NewInstance}  from 'aurelia-framework';
import {ApplicationState}     from '../../shared/application-state';
import {withModal}            from '../../shared/decorators';
import {GithubCreds}          from '../../shared/github-creds';
import {ManageEndpoints}      from '../../shared/manage-endpoints';
import {SESSION}              from 'monterey-pal';
import {ValidationRules}      from 'aurelia-validatejs';
import {ValidationController} from 'aurelia-validation';
import {Notification}         from '../../shared/notification';
import {Main}                 from '../../main/main';

@inject(ApplicationState, NewInstance.of(ValidationController), Notification, Main)
export class Screen {
  constructor(private state: ApplicationState,
              private validation: ValidationController,
              private notification: Notification,
              private main: Main) {
  }

  attached() {
    // ValidationRules
    // .ensure('checkForUpdatesOnStartup')
    // .on(this.state);
  }

  async save() {
    if (this.validation.validate().length > 0) {
      this.notification.error('There are validation errors');
      return;
    }

    await this.state._save();
    this.notification.success('Changes saved');
  }

  clearGithub() {
    this.state.gitAuthorization = null;
  }

  @withModal(GithubCreds)
  async configureGithub() {}

  @withModal(ManageEndpoints)
  async manageEndpoints() {}

  goBack() {
    this.main.returnToPluginList();
  }
}
