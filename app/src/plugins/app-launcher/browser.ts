import {Main}            from '../../main/main';
import {LauncherManager} from './launcher-manager';
import {Notification, Project, OS, observable, autoinject, DialogController} from '../../shared/index';

@autoinject
export class Browser {
  platform: string;
  project: Project;
  global: boolean;

  @observable quickSearch;
  @observable showAllPlugins: boolean = false;

  endpointError: string;
  rawData;
  data;

  constructor(private dialogController: DialogController,
              private manager: LauncherManager,
              private notification: Notification,
              private main: Main) {
    this.platform = OS.getPlatform();
  }

  activate(model) {
    this.project = model.project;
    this.global = model.global;
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
    this.filterLaunchers(this.quickSearch);
  }

  filterLaunchers(filter) {
    if (!this.rawData) return;
    filter = filter || '';
    filter = filter.toLowerCase();

    this.data = {};
    this.data.platforms = this.rawData.platforms;
    this.data.launchers = {};

    this.rawData.platforms.forEach(platform => {
      if (!this.showAllPlugins && this.platform !== platform) return;

      this.data.launchers[platform] = this.rawData.launchers[platform].filter(item => {
          return filter === '' || item.name.toLowerCase().indexOf(filter) !== -1 || item.description.toLowerCase().indexOf(filter) !== -1;
      });
    });
  }



  async install(tile, launcher) {
    if (tile.dataLoaded) {
      if (tile.errors) return;

      // install the launcher
      try {
        await this.manager.installLauncher(this.global ? undefined : this.project, this.platform, launcher.path);
        this.notification.success('App launcher installed');
      }
      catch (err) {
        console.log(err);
        this.notification.error(`Failed to install app launcher: ${err.message}`);
      }
    }
  }

  goBack() {
    this.main.activateScreen('plugins/app-launcher/screen');
  }
}

export class PlatformNameValueConverter {
  toView(platform) {
    let result: string;

    switch (platform) {
      case 'win32':
        result = 'Windows';
        break;
      case 'darwin':
        result = 'Mac';
        break;
    }

    return result;
  }
}