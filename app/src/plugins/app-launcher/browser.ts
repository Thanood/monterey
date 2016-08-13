import {LauncherManager}        from './launcher-manager';
import {observable, autoinject} from 'aurelia-framework';
import {OS}                     from 'monterey-pal';
import {Main}                   from '../../main/main';

@autoinject
export class Browser {
  platform: string;
  platformDisplay: string;

  @observable quickSearch;
  @observable showAllPlugins: boolean = false;
  
  endpointError: string;
  rawData;
  data;

  constructor(private manager: LauncherManager,
              private main: Main) {
    this.manager = manager;
    this.platform = OS.getPlatform();
    this.platformDisplay = this.platform;

    switch(this.platform) {
      case 'win32':
        this.platformDisplay = 'Windows';
        break;
      case 'darwin':
        this.platformDisplay = 'Mac';
        break;
    }
  }

  attached() {
    this.manager.getList()
    .then(data => {
      this.rawData = data;
      this.filterLaunchers(this.quickSearch);
    }).catch(err => {
      this.endpointError = err.message;
    });        
  }

  quickSearchChanged(newValue) {
    this.filterLaunchers(newValue);
  }

  showAllPluginsChanged() {
    this.filterLaunchers(this.quickSearch)
  }

  filterLaunchers(filter) {
    if(!this.rawData) return;
    filter = filter || "";
    filter = filter.toLowerCase();

    this.data = {};
    this.data.platforms = this.rawData.platforms;
    this.data.launchers = {};

    this.rawData.platforms.forEach(platform => {
      if(!this.showAllPlugins && this.platform !== platform) return;

      this.data.launchers[platform] = this.rawData.launchers[platform].filter(item => {
          return filter === "" || item.name.toLowerCase().indexOf(filter) !== -1 || item.description.toLowerCase().indexOf(filter) !== -1;
      });
    });
  }

  goBack() {
    this.main.activateScreen('plugins/app-launcher/screen');
  }
}