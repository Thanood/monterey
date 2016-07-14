import {inject, observable, NewInstance}    from 'aurelia-framework';
import {ApplicationState}     from '../../shared/application-state';
import {Main}                 from '../../main/main';
import {ValidationRules}      from 'aurelia-validatejs';
import {ValidationController} from 'aurelia-validation';

@inject(ApplicationState, NewInstance.of(ValidationController), Main)
export class Screen {
  @observable selectedLauncher;
  model;
  project;

  constructor(private state: ApplicationState,
              private validation: ValidationController,
              private main: Main) {
    if (!this.state.appLaunchers) {
      this.state.appLaunchers = [];
    }

    this.selectFirst();
  }

  activate(model) {
    this.model = model;
    this.model.beforeReturn = () => this.beforeReturn();
    this.project = model.selectedProject;
  }

  selectedLauncherChanged() {
    ValidationRules
    .ensure('title').required()
    .ensure('cmd').required()
    .on(this.selectedLauncher);
  }

  addNew() {
    this.state.appLaunchers.push({
      data: {
        title: 'Name'
      }
    });

    this.selectFirst();

    this.state._save();
  }

  remove() {
    if (!confirm('Are you sure?')) {
      return;
    }

    let index = this.state.appLaunchers.indexOf(this.selectedLauncher);
    this.state.appLaunchers.splice(index, 1);

    this.selectFirst();
  }

  selectFirst() {
    if (this.state.appLaunchers.length > 0) {
      this.selectLauncher(this.state.appLaunchers[0]);
    } else {
      this.selectLauncher(null);
    }
  }

  selectLauncher(launcher) {
    try {
      this.selectedLauncher = launcher;
    } catch (e) { // eslint-disable-line empty-block
      // aurelia-validatejs throws an error when the selectedLauncher gets set to null
    }

    return true;
  }

  openBrowser() {
    this.main.activateScreen('plugins/app-launcher/browser');
  }

  async save() {
    if (this.validation.validate().length > 0) {
      alert('There are validation errors');
      return;
    }

    await this.state._save();
    alert('Changes saved');
  }

  beforeReturn() {
    this.main.refreshTiles();
  }

  createId() {
    return Math.floor((Math.random() * 999999999) + 111111111);
  }
}
