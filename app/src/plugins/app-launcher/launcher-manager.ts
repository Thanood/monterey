import {autoinject}         from 'aurelia-framework';
import {MontereyRegistries} from '../../shared/monterey-registries';
import {Project}            from '../../shared/project';
import {ApplicationState}   from '../../shared/application-state';
import {FS, ELECTRON}       from 'monterey-pal';
import {TaskManager}        from '../task-manager/task-manager';

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

  // get a specific launcher
  async getLauncher(platform: string, launcherPath: string) {
    let result = await this.registry.getAppLauncherData(platform, launcherPath);
    return result;
  }

  // installs a launcher to the app state
  // project can be undefined, in which case the launcher is installed globally
  installLauncher(project: Project | undefined, platform: string, launcherPath: string) {
    // TODO: Enable this again
    // this.taskManager.addTask({
    //   promise: this.tryInstallLauncherFromRemote(project, platform, launcherPath),
    //   title: `Installing launcher ${platform}/${launcherPath}`
    // });        
  }


  // project can be undefined, in which case the launcher is installed globally
  async tryInstallLauncherFromRemote(project: Project | undefined, platform: string, launcherPath: string) {
    try {
      let result = await this.getLauncher(platform, launcherPath);

      let root = ELECTRON.getPath('userData');
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

      (project ? project.appLaunchers : this.state.appLaunchers).push(result);

      this.state._save();
    }
    catch(err) {
      throw new Error(`Failed to install ${platform}/${launcherPath} launcher: ${err.message}`);
    }
  }
}