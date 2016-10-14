import {UpdateModal} from './update-modal';
import {OS, ELECTRON, FS, SESSION} from 'monterey-pal';
import {GithubAPI, autoinject, DialogService, Logger, LogManager} from '../shared/index';

const logger = <Logger>LogManager.getLogger('updater');

@autoinject()
export class Updater {
  constructor(private githubAPI: GithubAPI,
              private dialogService: DialogService) {}

  async checkForUpdate() {
    if (await this.needUpdate()) {
      logger.info('Update available, showing update modal');

      let result = await this.dialogService.open(UpdateModal);
      if (!result.wasCancelled) {
        await this.update();
      } else {
        logger.info('Update modal was cancelled');
      }
    } else {
      logger.info('Update not needed');
    }
  }

  async update() {
    logger.info('Going to update');
    alert('update');
    // let autoUpdater = ELECTRON.getAutoUpdater();
  }

  async needUpdate() {
    if (SESSION.getEnv() === 'development') {
      logger.info('Development mode detected, not going to update');
      return false;
    }

    let release = await this.githubAPI.getLatestRelease('monterey-framework/monterey');
    let latestVersion = release.name;

    let packageJSON = JSON.parse(await FS.readFile(FS.join(FS.getRootDir(), 'package.json')));
    let currentVersion = `v${packageJSON.version}`;

    logger.info(`Current version: ${currentVersion}, latest version: ${latestVersion}`);

    return latestVersion !== currentVersion;
  }
}