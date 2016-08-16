import 'bootstrap';
import {LogManager}                      from 'aurelia-framework';
import {MonteryLogAppender}              from './shared/monterey-logger';
import {BootstrapFormValidationRenderer} from './shared/bootstrap-validation-renderer';
import {ApplicationState}                from './shared/application-state';
import {Errors}                          from './plugins/errors/errors';
import {Notification}                    from './shared/notification';
import {ELECTRON}                        from 'monterey-pal';

LogManager.addAppender(new MonteryLogAppender());
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
  let notification = <Notification>aurelia.container.get(Notification);


  // the main process sends all messages to the renderer process via the ipcRenderer.
  // this way the render process is in control of what gets logged in the logfile and what's displayed on screen
  ELECTRON.getIpcRenderer().on('message', (event: string, visible: boolean, id: string, level: string, message: string) => {
    let logger = LogManager.getLogger(id);
    if (visible) {
      if (notification[level]) {
        notification[level](message);
      }
    }
    if (logger[level]) {
      logger[level](message);
    }
  });

  // catch all uncatched errors in the renderer process
  window.onerror = (message: string, filename?: string, lineno?: number, colno?: number, error?: Error) => {
    let logger = LogManager.getLogger('global exception');
    console.log(error);
    errors.add(error);
    logger.error(error);
  };

  // catch all unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event: any) {
    let logger = LogManager.getLogger('global exception');
    console.log(event);
    if (event.reason) {
      errors.add({message: event.reason.message});
    }
    logger.error(event);
  });

  // register the bootstrap validation error renderer under the bootstrap-form key
  // so that aurelia-validation uses this renderer when validation-renderer="bootstrap-form" is put on a form
  aurelia.container.registerHandler('bootstrap-form', container => container.get(BootstrapFormValidationRenderer));

  aurelia.start().then(() => aurelia.setRoot());
}
