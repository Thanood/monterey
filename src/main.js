import 'bootstrap';
import {BootstrapFormValidationRenderer} from './shared/bootstrap-validation-renderer';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-dialog', config => {
      config.useDefaults();
      config.settings.lock = true;
      config.settings.centerHorizontalOnly = false;
    })
    .plugin('aurelia-validation')
    .plugin('aurelia-validatejs')
    .feature('landing')
    .feature('scaffolding');

  // register the bootstrap validation error renderer under the bootstrap-form key
  // so that aurelia-validation uses this renderer when validation-renderer="bootstrap-form" is put on a form
  aurelia.container.registerHandler('bootstrap-form', container => container.get(BootstrapFormValidationRenderer));

  aurelia.start().then(() => aurelia.setRoot());
}