import 'bootstrap';
import {LogManager}                      from 'aurelia-framework';
import {MonteryLogAppender}              from './shared/monterey-logger';
import {BootstrapFormValidationRenderer} from './shared/bootstrap-validation-renderer';
import {KendoAureliaDialogRenderer}      from './shared/kendo-aurelia-dialog-renderer';
import {ApplicationState}                from './shared/application-state';
import {Cleanup}                         from './cleanup';
import {IPC}                             from './ipc';
import {GlobalExceptionHandler}          from './global-exception-handler';

LogManager.addAppender(new MonteryLogAppender());
LogManager.setLevel(LogManager.logLevel.debug);

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-dialog', config => {
      config.useStandardResources();
      config.useCSS('');
      config.useRenderer(KendoAureliaDialogRenderer)
    })
    .plugin('aurelia-v-grid')
    .plugin('aurelia-validation')
    .plugin('aurelia-validatejs')
    .plugin('context-menu')
    .feature('landing')
    .feature('main')
    .feature('scaffolding')
    .feature('plugins');

  let cleanup = new Cleanup();
  let ipc = new IPC(aurelia);
  let globalExceptionHandler = new GlobalExceptionHandler(aurelia);

  // register the bootstrap validation error renderer under the bootstrap-form key
  // so that aurelia-validation uses this renderer when validation-renderer="bootstrap-form" is put on a form
  aurelia.container.registerHandler('bootstrap-form', container => container.get(BootstrapFormValidationRenderer));

  aurelia.start().then(() => aurelia.setRoot()).then(() => {
    // Monterey has been loaded, let the main process know
    // so that the main process can trigger the auto update process
    ipc.notifyMainOfStart();
  });
}
