const electron = require('electron');
const app = electron.app;
const handleStartupEvent = require('./startuphandler.js');
const BrowserWindow = electron.BrowserWindow;
const update = require('./updater');
let mainWindow;

// handle any Squirrel event (installer events)
if (!handleStartupEvent()) {
  require('electron-debug')({ enabled: true });

  app.commandLine.appendSwitch('enable-transparent-visuals');
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('ready', () => {
    mainWindow = new BrowserWindow({
      width: 1024,
      height: 768
    });

    global.mainWindow = mainWindow;
    global.rootDir = __dirname;

    mainWindow.setMenu(null);
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.setTitle('Monterey');
    });

    // start checking for updates
    update(mainWindow);

    // whenever an anchor with target _blank gets opened, open this via the `open` module
    // so that the native browser is opened
    mainWindow.webContents.on('new-window', function(e, url) {
      e.preventDefault();
      var open = require('open');
      open(url);
    });

    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  });
}


