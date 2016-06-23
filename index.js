//Note: This file is provided as an aid to help you get up and running with
//Electron for desktop apps. See the readme file for more information.
/* eslint-disable strict, no-var, no-console */

'use strict';

const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  setApplicationMenu();

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.setTitle('Monterey');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

let setApplicationMenu = function() {
  // var menus = [];
  // if (env.name !== 'production') {
  //   menus.push(devMenuTemplate);
  // }
  Menu.setApplicationMenu(Menu.buildFromTemplate(devMenuTemplate));
};

let devMenuTemplate = [{
  label: 'DevTools',
  submenu: [{
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: function() {
      BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache();
    }
  }, {
    label: 'Toggle DevTools',
    accelerator: 'Alt+CmdOrCtrl+I',
    click: function() {
      BrowserWindow.getFocusedWindow().toggleDevTools();
    }
  }, {
    label: 'Quit',
    accelerator: 'CmdOrCtrl+Q',
    click: function() {
      app.quit();
    }
  }]
}];
