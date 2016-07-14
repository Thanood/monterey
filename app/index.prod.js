const electron = require('electron');
const app = electron.app;
const handleStartupEvent = require('./startuphandler.js');
const storage = require('electron-json-storage');
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

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


