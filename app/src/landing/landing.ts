import {ScaffoldProject} from '../scaffolding/scaffold-project';
import {withModal, ApplicationState, ProjectFinder,
  PluginManager, autoinject, LogManager, Logger, Router} from '../shared/index';

const logger = <Logger>LogManager.getLogger('landing');

@autoinject()
export class Landing {

  constructor(private projectFinder: ProjectFinder,
              private applicationState: ApplicationState,
              private pluginManager: PluginManager,
              private router: Router) {
    if (!applicationState.__meta__) {
      applicationState.__meta__ = {};
    }
    applicationState.__meta__.firstStart = true;
  }

  async activate() {
    await this.pluginManager.notifyOfNewSession(this.applicationState);
    await this.applicationState._save();

    logger.info('user reached landing screen');
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
