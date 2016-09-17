import {bindable, autoinject} from 'aurelia-framework';
import {LauncherManager}      from './launcher-manager';
import {Project}              from '../../shared/index';
import {Main}                 from '../../main/main';

@autoinject()
export class LauncherItem {

  @bindable launcher;
  @bindable platform;
  @bindable install;

  dataLoaded: boolean = false;
  errors: string;
  icon: any;

  constructor(private manager: LauncherManager) {
  }

  async attached() {
    // Try and download the launcher data file
    try {
      let result = await this.manager.getLauncher(this.platform, this.launcher.path);
      this.dataLoaded = true;
      this.icon = result.image;
    }
    catch (err) {
      this.errors = err;
      this.dataLoaded = true;
      this.icon = 'images/monterey-logo.png';
    }
  }
}