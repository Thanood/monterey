import 'bootstrap';
import {LogManager}                      from 'aurelia-framework';
import {ConsoleAppender}                 from 'aurelia-logging-console';
import {BootstrapFormValidationRenderer} from './shared/bootstrap-validation-renderer';
import {ApplicationState}                from './shared/application-state';
import {Errors}                          from './plugins/errors/errors';

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
    .plugin('aurelia-v-grid')
    .plugin('aurelia-validation')
    .plugin('aurelia-validatejs')
    .feature('landing')
    .feature('main')
    .feature('scaffolding')
    .feature('plugins');

  let errors = <Errors>aurelia.container.get(Errors);
  let logger = LogManager.getLogger('global exception');
  window.onerror = (message: string, filename?: string, lineno?: number, colno?: number, error?: Error) => {
    console.log(error);
    errors.add(error);
    logger.error(error);
  };
  window.addEventListener('unhandledrejection', function(event: any) {
    console.log(event);
    errors.add({ message: event.reason.message });
    logger.error(event);
  });

  // register the bootstrap validation error renderer under the bootstrap-form key
  // so that aurelia-validation uses this renderer when validation-renderer="bootstrap-form" is put on a form
  aurelia.container.registerHandler('bootstrap-form', container => container.get(BootstrapFormValidationRenderer));

  aurelia.start().then(() => aurelia.setRoot());
}
