import 'bootstrap';
import {LogManager, Aurelia}             from 'aurelia-framework';
import {MonteryLogAppender}              from './shared/monterey-logger';
import {BootstrapFormValidationRenderer} from './shared/bootstrap-validation-renderer';
import {KendoAureliaDialogRenderer}      from './shared/kendo-aurelia-dialog-renderer';
import {ApplicationState}                from './shared/application-state';
import {ProjectManager}                  from './shared/project-manager';
import {ExitProcedure}                   from './shared/exit-procedure';
import {IPC}                             from './shared/ipc';
import {GlobalExceptionHandler}          from './shared/global-exception-handler';
import {FileSystemLogger}                from './shared/file-system-logger';
import {ThemeManager}                    from './shared/theme-manager';
import {Settings}                        from './shared/settings';

export async function configure(aurelia: Aurelia) {
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

  // register monterey's log appender
  LogManager.addAppender(aurelia.container.get(MonteryLogAppender));
  LogManager.setLevel(LogManager.logLevel.debug);

  // initialize the logger
  let logger = <FileSystemLogger>aurelia.container.get(FileSystemLogger);
  try {
    await logger.activate();
  } catch (e) {
    console.log('failed to initialize logger');
    console.log(e);
  }

  let exitProcedure = new ExitProcedure();
  let ipc = new IPC(aurelia);
  let globalExceptionHandler = new GlobalExceptionHandler(aurelia);


  // restore the session
  let applicationState = <ApplicationState>aurelia.container.get(ApplicationState);
  let projectManager = <ProjectManager>aurelia.container.get(ProjectManager);
  if (!(await applicationState._isNew())) {
    await applicationState._loadStateFromSession();
    await projectManager.verifyProjectsExistence();
  }

  await logger.cleanupLogs();
  
  
  // register the bootstrap validation error renderer under the bootstrap-form key
  // so that aurelia-validation uses this renderer when validation-renderer="bootstrap-form" is put on a form
  aurelia.container.registerHandler('bootstrap-form', container => container.get(BootstrapFormValidationRenderer));

  aurelia.start()
  .then((au) => {
    let themeManager = <ThemeManager>au.container.get(ThemeManager);
    let settings = <Settings>au.container.get(Settings);
    return themeManager.load(<string>settings.getValue('theme'));
  })
  .then(() => aurelia.setRoot())
  .then(() => {
    // Monterey has been loaded, let the main process know
    // so that the main process can trigger the auto update process
    ipc.notifyMainOfStart();
  });
}
