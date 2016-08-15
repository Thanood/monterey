'use strict';

const electron = require('electron');
const storage = require('electron-json-storage');
const app = electron.app;
const Logger = require('./logger');
const electronConnect = require('../node_modules/electron-connect');
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;
const fixPath = require('fix-path');

var log = new Logger();
log.activate();


fixPath();

app.commandLine.appendSwitch('enable-transparent-visuals');

app.on('window-all-closed', () => {
  log.flushBuffer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  setApplicationMenu();

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    icon: __dirname + '/images/monterey.ico'
  });

  global.mainWindow = mainWindow;
  global.rootDir = __dirname;

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  var client = electronConnect.client.create(mainWindow);

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
    client.sendMessage('closed');
  });
});

let setApplicationMenu = function() {
  Menu.setApplicationMenu(Menu.buildFromTemplate(devMenuTemplate));
};

let devMenuTemplate = [
  {
    label: "Application",
    submenu: [
      { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
    ]
  }, 
  {
    label: "Edit",
    submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:", role: 'undo' },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:", role: 'redo' },
      { type: "separator" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:", role: 'cut' },
      { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:", role: 'copy' },
      { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:", cole: 'paste' },
      { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:", role: 'selectall' }
    ]
  }, 
  {
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
      label: 'Clear cache',
      click: function() {
        storage.clear(function (err){});
        BrowserWindow.getFocusedWindow().loadURL(`file://${__dirname}/index.html`);;
      },
    }, {
      label: 'Quit',
      accelerator: 'CmdOrCtrl+Q',
      click: function() {
        app.quit();
      }
    }
  ]
}];

