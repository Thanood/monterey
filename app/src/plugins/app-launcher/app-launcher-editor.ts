import {autoinject, bindable} from 'aurelia-framework';
import {Main}                 from '../../main/main';
import {ApplicationState}     from '../../shared/application-state';
import {Notification}         from '../../shared/notification';
import {RandomNumber}         from '../../shared/random-number';
import {withModal}            from '../../shared/decorators';
import {Project}              from '../../shared/project';
import {ShareModal}           from './share-modal';
import {Browser}              from './browser';

@autoinject()
export class AppLauncherEditor {
  model;
  @bindable project: Project;
  @bindable global = true;
  selectedLauncher;
  launchers: Array<any>;

  constructor(private state: ApplicationState,
              private main: Main,
              private notification: Notification) {
  }

  attached() {
    if (!this.global && !this.project.appLaunchers) {
      this.project.appLaunchers = [];
    }
    if (this.global && !this.state.appLaunchers) {
      this.state.appLaunchers = [];
    }

    this.launchers = (this.global ? this.state.appLaunchers : this.project.appLaunchers);

    this.selectFirst();
  }

  addNew() {
    this.launchers.push({
      id: new RandomNumber().create(),
      data: {
        title: 'Name',
        enabled: true
      }
    });

    this.selectLauncher(this.launchers[this.launchers.length - 1]);

    this.state._save();
  }

  remove() {
    if (!confirm('Are you sure?')) {
      return;
    } 

    let index = this.launchers.indexOf(this.selectedLauncher);
    this.launchers.splice(index, 1);

    this.selectFirst();
  }

  selectFirst() {
    if (this.launchers.length > 0) {
      this.selectLauncher(this.launchers[0]);
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

  @withModal(Browser, function () { return { project: this.project, global: this.global }; }, { height: 600 })
  openBrowser() {
    if (this.launchers.length > 0) {
      this.selectFirst();
    }
  }

  async save() {
    if (this.launchers.filter(x => x.data.enabled && !x.data.title).length > 0) {
      this.notification.error('All app launchers need a title');
      return;
    }

    await this.state._save();
    this.notification.success('Changes saved');
  }

  @withModal(ShareModal, function (launcher) { return launcher })
  share() {}
}