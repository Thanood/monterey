import {inject, NewInstance}  from 'aurelia-framework';
import {ApplicationState}     from '../../shared/application-state';
import {withModal}            from '../../shared/decorators';
import {GithubCreds}          from '../../shared/github-creds';
import {ManageEndpoints}      from '../../shared/manage-endpoints';
import {NPM}                  from 'monterey-pal';
import {ValidationRules}      from 'aurelia-validatejs';
import {ValidationController} from 'aurelia-validation';
import {Notification}         from '../../shared/notification';
import {Main}                 from '../../main/main';

@inject(ApplicationState, NewInstance.of(ValidationController), Notification, Main)
export class Screen {
  npmRegistry: string;
  _npmRegistry: string;
  npmStrictSSL: boolean;
  _npmStrictSSL: boolean;
  loading: boolean;

  constructor(private state: ApplicationState,
              private validation: ValidationController,
              private notification: Notification,
              private main: Main) {
  }

  async attached() {
    this.loading = true;

    await this.load();
    
    this.loading = false;
  }

  async load() {
    // we can probably make this more dynamic (if we decide to add more settings)
    this.npmStrictSSL = (await NPM.getConfig('strict-ssl')).trim() === 'true';
    this._npmStrictSSL = this.npmStrictSSL;

    this.npmRegistry = (await NPM.getConfig('registry')).trim();
    this._npmRegistry = this.npmRegistry;
  }

  async save() {
    if (this.validation.validate().length > 0) {
      this.notification.error('There are validation errors');
      return;
    }

    this.loading = true;

    let reloadNPM = false;

    if (this._npmRegistry !== this.npmRegistry) {
      await NPM.setConfig('registry', `${this.npmRegistry}`);
      reloadNPM = true;
    }

    if (this._npmStrictSSL !== this.npmStrictSSL) {
      await NPM.setConfig('strict-ssl', `${this.npmStrictSSL}`);
      reloadNPM = true;
    }

    if (reloadNPM){
      await this.load();
    }

    await this.state._save();
    this.notification.success('Changes saved');

    this.loading = false;
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
