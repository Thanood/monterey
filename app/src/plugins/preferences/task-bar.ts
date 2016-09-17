import {autoinject, useView} from 'aurelia-framework';
import {Main}                from '../../main/main';

@useView('../task-bar/default-item.html')
@autoinject()
export class TaskBar {
  text = 'preferences';
  icon = 'fa fa-wrench';
  tooltip = 'tooltip-preferences';

  constructor(private main: Main) {}

  onClick() {
    this.main.activateScreen('plugins/preferences/screen');
  }
}