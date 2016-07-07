import {autoinject}     from 'aurelia-framework';
import {UpdateChecker}  from './shared/update-checker';
import {ProjectManager} from './shared/project-manager';
import {PluginManager}  from './shared/plugin-manager';
import {ApplicationState} from './shared/application-state';

@autoinject()
export class App {

  constructor(private updateChecker: UpdateChecker,
              private pluginManager: PluginManager, 
              private applicationState: ApplicationState,
              private projectManager: ProjectManager) {
  }

  async activate() {
    if (await this.applicationState._isNew()) {
      await this.pluginManager.notifyOfNewSession(this.applicationState);
      await this.applicationState._save();
    } else {
      await this.applicationState._loadStateFromSession();
    }
  }

  attached() {
    this.updateChecker.checkUpdates();
  }

  configureRouter(config, router) {
    config.title = 'Monterey';

    if (!this.projectManager.hasProjects()) {
      router.addRoute({ route: '', redirect: 'landing' });
    } else {
      router.addRoute({ route: '', redirect: 'main' });
    }
  }
}
