import {UpdateModal} from './update-modal';
import {OS, ELECTRON, FS, SESSION} from 'monterey-pal';
import {GithubAPI, autoinject, Settings, DialogService, Notification, Logger, LogManager} from '../shared/index';

const logger = <Logger>LogManager.getLogger('updater');

@autoinject()
export class Updater {
  constructor(private githubAPI: GithubAPI,
              private dialogService: DialogService,
              private notification: Notification,
              private settings: Settings) {}

  async checkForUpdate() {
    if (!this.settings.getValue('check-for-updates')) {
      return;
    }

    if (!await this.needUpdate()) {
      logger.info('Update not needed');
      return;
    }

    logger.info('Update available, showing update modal');

    let result = await this.dialogService.open(UpdateModal);
    if (!result.wasCancelled) {
      await this.update();
    } else {
      logger.info('Update modal was cancelled');
    }
  }

  async update() {
    logger.info('Going to update');
    // alert('update');
    // let autoUpdater = ELECTRON.getAutoUpdater();
  }

  async needUpdate() {
    if (SESSION.getEnv() === 'development') {
      logger.info('Development mode detected, not going to update');
      return false;
    }

    try {
      let release = await this.githubAPI.getLatestRelease('monterey-framework/monterey');
      let latestVersion = release.name;

      let currentVersion = await this._getCurrentVersion();

      logger.info(`Current version: ${currentVersion}, latest version: ${latestVersion}`);

      return latestVersion !== currentVersion;
    } catch (error) {
      if (error.status === 401) {
        this.notification.info('Could not check for updates. GitHub returned "Unauthorized"');
      }
      return false;
    }
  }

  async _getCurrentVersion() {
    let packageJSON = JSON.parse(await FS.readFile(FS.join(FS.getRootDir(), 'package.json')));
    return `v${packageJSON.version}`;
  }
}