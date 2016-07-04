import {inject, observable, NewInstance}    from 'aurelia-framework';
import {ApplicationState}     from '../../shared/application-state';
import {Main}                 from '../../main/main';
import {ValidationRules}      from 'aurelia-validatejs';
import {ValidationController} from 'aurelia-validation';

@inject(ApplicationState, NewInstance.of(ValidationController), Main)
export class Screen {
  @observable selectedLauncher;

  constructor(state, validation, main) {
    this.state = state;
    this.validation = validation;
    this.main = main;

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
      id: this.createId(),
      title: 'Name'
    });

    this.selectFirst();

    this.state.save();
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
  }

  async save() {
    await this.state.save();
    alert('Changes saved');
  }

  beforeReturn() {
    this.main.refreshTiles();
  }

  createId() {
    return Math.floor((Math.random() * 999999999) + 111111111);
  }
}
