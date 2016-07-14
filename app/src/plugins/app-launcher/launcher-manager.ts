import {MontereyRegistries} from '../../shared/monterey-registries';
import {autoinject} from 'aurelia-framework';
import {ApplicationState}    from '../../shared/application-state';
import {FS} from 'monterey-pal';
import {TaskManager}      from '../../task-manager/task-manager';

@autoinject
export class LauncherManager {
    
    registry:MontereyRegistries;
    state:ApplicationState;
    taskManager:TaskManager;

    constructor(registry:MontereyRegistries, state:ApplicationState, taskManager:TaskManager) {
        this.registry = registry;
        this.state = state;
        this.taskManager = taskManager;
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
            let file = await FS.downloadFile(result.remoteImagePath, root + "/images/app-launcher/" + platform + "/" + launcherPath + ".png");

            result.data.img = root + "/images/app-launcher/" + platform + "/" + launcherPath + ".png";
            result.data.enabled = true;

            this.state.appLaunchers.push(result);
        }
        catch(err) {
            throw new Error(`Failed to install ${platform}/${launcherPath} launcher: ${err.message}`);
        }
    }
}