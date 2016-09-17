import {autoinject, LogManager} from 'aurelia-framework';
import {Logger}                 from 'aurelia-logging';
import {FS, ELECTRON}           from 'monterey-pal';
import {TaskManager, Task}      from '../task-manager/index';
import {Project, ApplicationState, MontereyRegistries} from '../../shared/index';

const logger = <Logger>LogManager.getLogger('launcher-manager');

@autoinject
export class LauncherManager {

  constructor(private registry: MontereyRegistries,
              private state: ApplicationState,
              private taskManager: TaskManager) {
  }

  // gets launchers from the remote registry
  async getList() {
    try {
      let result = await this.registry.getAppLaunchers();

      let mapped: any = {};
      mapped.platforms = [];

      for (let prop in result) {
        mapped.platforms.push(prop);
      }

      mapped.launchers = result;

      return mapped;
    }
    catch (err) {
      throw err;
    }
  }

  // get a specific launcher
  async getLauncher(platform: string, launcherPath: string) {
    let result = await this.registry.getAppLauncherData(platform, launcherPath);
    return result;
  }

  // installs a launcher to the app state
  async installLauncher(project: Project | undefined, platform: string, launcherPath: string) {
    await this.tryInstallLauncherFromRemote(project, platform, launcherPath);
  }


  // project can be undefined, in which case the launcher is installed globally
  async tryInstallLauncherFromRemote(project: Project | undefined, platform: string, launcherPath: string) {
    try {
      let result = await this.getLauncher(platform, launcherPath);

      let root = ELECTRON.getPath('userData');
      let imgFolder = FS.join(root, '/images/app-launcher/', platform, '/');

      // create folder structure where the image of the app-launcher will be downloaded to
      if (!(await FS.folderExists(imgFolder))) {
        logger.info(`folder ${imgFolder} does not exist, creating it`);
        await FS.createFolder(imgFolder);
      } else {
        logger.info(`folder ${imgFolder} already exists`);
      }

      let imgSrc = result.remoteImagePath;
      let imgTarget =  FS.join(imgFolder, launcherPath + '.png');
      let file = await FS.downloadFile(imgSrc, imgTarget);

      result.data.img = root + '/images/app-launcher/' + platform + '/' + launcherPath + '.png';
      logger.info(`img path: ${result.data.img}`);
      result.data.enabled = true;

      (project ? project.appLaunchers : this.state.appLaunchers).push(result);

      await this.state._save();
    }
    catch (err) {
      throw new Error(`Failed to install ${platform}/${launcherPath} launcher: ${err.message}`);
    }
  }
}