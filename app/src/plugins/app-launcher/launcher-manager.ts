import {MontereyRegistries} from '../../shared/monterey-registries';
import {autoinject}         from 'aurelia-framework';
import {ApplicationState}   from '../../shared/application-state';
import {FS}                 from 'monterey-pal';
import {TaskManager}        from '../task-manager/task-manager';

@autoinject
export class LauncherManager {

  constructor(private registry: MontereyRegistries, 
              private state: ApplicationState, 
              private taskManager: TaskManager) {
  }

  // Gets launchers from the remote registry
  async getList() {
    try {
      let result = await this.registry.getAppLaunchers();

      let mapped:any = {};
      mapped.platforms = [];

      for(let prop in result) {
        mapped.platforms.push(prop);
      }

      mapped.launchers = result;
      
      return mapped;
    } 
    catch(err) {
      throw err;
    }
  }

  // Get a specific launcher
  async getLauncher(platform, launcherPath) {
      let result = await this.registry.getAppLauncherData(platform, launcherPath);
      return result;
  }

  // Installs a launcher to the app state
  installLauncher(platform, launcherPath) {
    this.taskManager.addTask({
      promise: this.tryInstallLauncherFromRemote(platform, launcherPath),
      title: `Installing launcher ${platform}/${launcherPath}`
    });        
  }


  async tryInstallLauncherFromRemote(platform, launcherPath) {
    try {
      let result = await this.getLauncher(platform, launcherPath);

      let root = FS.getRootDir();
      let imgFolder = FS.join(root, '/images/app-launcher/', platform, '/');

      // create folder structure where the image of the app-launcher will be downloaded to
      if (!(await FS.folderExists(imgFolder))) {
        await FS.createFolder(imgFolder);
      }

      let imgSrc = result.remoteImagePath;
      let imgTarget =  FS.join(imgFolder, launcherPath + '.png');
      let file = await FS.downloadFile(imgSrc, imgTarget);

      result.data.img = root + '/images/app-launcher/' + platform + '/' + launcherPath + '.png';
      result.data.enabled = true;

      this.state.appLaunchers.push(result);

      this.state._save();
    }
    catch(err) {
      throw new Error(`Failed to install ${platform}/${launcherPath} launcher: ${err.message}`);
    }
  }
}