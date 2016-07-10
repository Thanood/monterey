//Note: This file is provided as an aid to help you get up and running with
//Electron for desktop apps. See the readme file for more information.
/* eslint-disable strict, no-var, no-console */

'use strict';

const electron = require('electron');
const storage = require('electron-json-storage');
const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

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