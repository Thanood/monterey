import 'bootstrap';
import {LogManager, Aurelia}             from 'aurelia-framework';
import {I18N}                            from 'aurelia-i18n';
import * as Backend                      from 'i18next-xhr-backend';
import {ELECTRON}                        from 'monterey-pal';
import {
  MonteryLogAppender,
  BootstrapFormValidationRenderer,
  KendoAureliaDialogRenderer,
  ApplicationState,
  ProjectManager,
  ExitProcedure,
  IPC,
  GlobalExceptionHandler,
  FileSystemLogger,
  ThemeManager,
  Settings
} from './shared/index';

export async function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-dialog', config => {
      config.useStandardResources();
      config.useCSS('');
      config.useRenderer(KendoAureliaDialogRenderer);
    })
    .plugin('aurelia-i18n', (instance) => {
      // register backend plugin
      instance.i18next.use(Backend);
      let settings = <Settings>aurelia.container.get(Settings);

      return instance.setup({
        backend: {
          loadPath: './locales/{{lng}}/{{ns}}.json',
        },
        lng : <string>settings.getValue('language') || 'en',
        fallbackLng: 'en',
        attributes : ['t', 'i18n'],
        debug : false
      });
    })
    .plugin('aurelia-v-grid')
    .plugin('aurelia-validation')
    .plugin('aurelia-validatejs')
    .plugin('context-menu')
    .feature('landing')
    .feature('main')
    .feature('scaffolding')
    .feature('plugins')
    .globalResources([
      System.normalizeSync('shared/tooltip/tooltip-attribute'),
      System.normalizeSync('shared/spinner')
    ]);

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
  aurelia.container.registerInstance(IPC, ipc);
  let globalExceptionHandler = new GlobalExceptionHandler(aurelia);


  // restore the session
  let applicationState = <ApplicationState>aurelia.container.get(ApplicationState);
  let projectManager = <ProjectManager>aurelia.container.get(ProjectManager);
  if (!(await applicationState._isNew())) {
    await applicationState._loadStateFromSession();
    await projectManager.verifyProjectsExistence();
  }

  await logger.cleanupLogs();

  // storing the state identifier in a global, so we can use that to clear
  // this exact session via the menu bar
  ELECTRON.getGlobal('paths').application_state = applicationState._getStateIdentifier();

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
