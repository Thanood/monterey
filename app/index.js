'use strict';

const argv = require('yargs').argv;
var environment = argv.env || 'production';

const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const notify = require('./notify');
const BrowserWindow = electron.BrowserWindow;
var mainWindow, client;

// fix PATH environment variable on mac
// https://github.com/monterey-framework/monterey/issues/100
const fixPath = require('fix-path');
fixPath();

// activate the logger
const Logger = require('./logger');
var log = new Logger(app);
log.activate();


app.commandLine.appendSwitch('enable-transparent-visuals');


// flush the log buffer before quit
app.on('before-quit', (e) => {
  log.flushBuffer();
});

const handleStartupEvent = require('./startuphandler.js');
const update = require('./updater');



// handle any Squirrel event (installer events)
if (isDev() || !handleStartupEvent()) {
  app.on('ready', () => {

    // set the menu
    Menu.setApplicationMenu(Menu.buildFromTemplate(devMenuTemplate));

    mainWindow = new BrowserWindow({
      width: 1024,
      height: 768,
      icon: __dirname + '/images/monterey.ico'
    });

    // these global vars are used in monterey-pal-electron
    global.mainWindow = mainWindow;
    global.rootDir = __dirname;
    global.app = app;
    global.environment = environment;

    mainWindow.loadURL(getIndex());

    if (isDev()) {
      const electronConnect = require('../node_modules/electron-connect');
      client = electronConnect.client.create(mainWindow);
    }

    let ipcMain = electron.ipcMain;
    ipcMain.on('monterey-ready', () => {
      if (!isDev()) {
        // check for updates
        update(mainWindow);
      } else {
        notify(false, 'info', 'updater', 'skipping auto update, development mode is active');
      }
    });

    // open anchors with target="_blank" in new browser window
    mainWindow.webContents.on('new-window', function(e, url) {
      e.preventDefault();
      var open = require('open');
      open(url);
    });

    // cleanup mainWindow variable on close event
    mainWindow.on('closed', (e) => {
      mainWindow = null;
    });
  });
}

let devMenuTemplate = [
  {
    label: "Monterey",
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
        if (!confirm('Are you sure? Monterey will start from scratch')) {
          return;
        }
        const storage = require('electron-json-storage');
        storage.clear(function (err){});
        BrowserWindow.getFocusedWindow().loadURL(getIndex());
      },
    }
  ]
}];

function getIndex() {
  return isDev() ? `file://${__dirname}/index.html` : `file://${__dirname}/index.prod.html`;
}

function confirm(message) {
  var dialog = electron.dialog;
  var choice = dialog.showMessageBox(
          BrowserWindow.getFocusedWindow(),
          {
              type: 'question',
              buttons: ['Yes', 'No'],
              title: 'Confirm',
              message: message
          });

  return choice === 0;
}

function isDev() {
  return environment === 'development';
}