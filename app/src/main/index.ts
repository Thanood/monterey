import {ProjectManager, Router} from '../shared/index';

export function configure(aurelia) {
  let router = <Router>aurelia.container.get(Router);
  let projectManager = <ProjectManager>aurelia.container.get(ProjectManager);

  router.addRoute({ route: 'main', name: 'main', moduleId: './main/main' });
}
