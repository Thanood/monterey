import {bindable, autoinject} from 'aurelia-framework';
import {LauncherManager}      from './launcher-manager';
import {Notification}         from '../../shared/notification';

@autoinject()
export class BrowserTile {

  @bindable launcher;
  @bindable platform;

  dataLoaded: boolean = false;
  errors: string;
  icon: any;

  constructor(private manager: LauncherManager,
              private notification: Notification) {
    this.manager = manager;
  }

  async attached() {
    // Try and download the launcher data file
    try {
      let result = await this.manager.getLauncher(this.platform, this.launcher.path);
      this.dataLoaded = true;
      this.icon = result.image;
    }        
    catch(err) {
      this.errors = err;
      this.dataLoaded = true;
      this.icon = 'images/monterey-logo.png';
    }
  }

  async install() {
    if(this.dataLoaded) {
      if(this.errors) return;

      // Do stuff
      try {
        await this.manager.installLauncher(this.platform, this.launcher.path);
        this.notification.success('App launcher installed');
      }
      catch (err) {
        alert(err.message);
      } 
    }
  }
}