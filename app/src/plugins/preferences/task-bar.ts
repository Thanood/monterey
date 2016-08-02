import {autoinject} from 'aurelia-framework';
import {Main}       from '../../main/main';

@autoinject()
export class TaskBar {
  constructor(private main: Main) {}

  openPreferences() {
    this.main.activateScreen('plugins/preferences/screen');
  }
}