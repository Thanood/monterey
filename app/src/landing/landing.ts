import {autoinject}       from 'aurelia-framework';
import {Router}           from 'aurelia-router';
import {withModal}        from '../shared/decorators';
import {ApplicationState} from '../shared/application-state';
import {ProjectFinder}    from '../shared/project-finder';
import {ScaffoldProject}  from '../scaffolding/scaffold-project';
import {PluginManager}    from '../shared/plugin-manager';

@autoinject()
export class Landing {

  constructor(private projectFinder: ProjectFinder,
              private applicationState: ApplicationState,
              private pluginManager: PluginManager,
              private router: Router) {
  }

  async activate() {
    await this.pluginManager.notifyOfNewSession(this.applicationState);
    await this.applicationState._save();
  }

  async open() {
    if (await this.projectFinder.openDialog()) {
      this.router.navigateToRoute('main');
    }
  }

  @withModal(ScaffoldProject)
  create() {
    this.router.navigateToRoute('main');
  }
}
