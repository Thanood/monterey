import 'bootstrap';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .feature('scaffolding');

  aurelia.start().then(() => aurelia.setRoot('app'));
}
