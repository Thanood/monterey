import 'bootstrap';
import {LogManager}                      from 'aurelia-framework';
import {ConsoleAppender}                 from 'aurelia-logging-console';
import {BootstrapFormValidationRenderer} from './shared/bootstrap-validation-renderer';
import {ProjectManager}                  from './shared/project-manager';

LogManager.addAppender(new ConsoleAppender());
LogManager.setLevel(LogManager.logLevel.debug);

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
    .feature('main')
    .feature('scaffolding')
    .feature('plugins');

  // register the bootstrap validation error renderer under the bootstrap-form key
  // so that aurelia-validation uses this renderer when validation-renderer="bootstrap-form" is put on a form
  aurelia.container.registerHandler('bootstrap-form', container => container.get(BootstrapFormValidationRenderer));

  let projectManager = aurelia.container.get(ProjectManager);

  // first load the application state from session, then start aurelia
  // so that at startup we can determine whether to load the main screen or landing screen
  projectManager._loadStateFromSession()
  .then(() => aurelia.start())
  .then(() => aurelia.setRoot());
}
