import {Router} from 'aurelia-router';

export function configure(aurelia) {
  let router = aurelia.container.get(Router);

  router.addRoute({ route: '', name: 'landing', moduleId: './landing/landing' });
}
