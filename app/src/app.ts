import {autoinject}       from 'aurelia-framework';
import {ProjectManager}   from './shared/project-manager';
import {PluginManager}    from './shared/plugin-manager';
import {ApplicationState} from './shared/application-state';

@autoinject()
export class App {

  constructor(private pluginManager: PluginManager,
              private applicationState: ApplicationState,
              private projectManager: ProjectManager) {
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
