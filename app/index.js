'use strict';

const argv = require('yargs').argv;
var environment = argv.env || 'production';

const electron = require('electron');
const app = electron.app;
const shell = electron.shell;
const Menu = electron.Menu;
const notify = require('./notify');
const BrowserWindow = electron.BrowserWindow;
const WindowStateManager = require('electron-window-state-manager');
const path = require('path');
var mainWindow, client;

// fix PATH environment variable on mac
// https://github.com/monterey-framework/monterey/issues/100
const fixPath = require('fix-path');
fixPath();

app.commandLine.appendSwitch('enable-transparent-visuals');

const handleStartupEvent = require('./startuphandler.js');

// stores and retrieves the width, height, x and y position
// of the window, in order to restore it after restarts
const mainWindowState = new WindowStateManager('mainWindow', {
    defaultWidth: 1024,
    defaultHeight: 768
});

// handle any Squirrel event (installer events)
if (isDev() || !handleStartupEvent()) {
  app.on('ready', () => {

    // set the menu
    Menu.setApplicationMenu(Menu.buildFromTemplate(devMenuTemplate));

    mainWindow = new BrowserWindow({
      width: mainWindowState.width,
      height: mainWindowState.height,
      x: mainWindowState.x,
      y: mainWindowState.y,
      icon: __dirname + '/images/monterey.ico'
    });

    if (mainWindowState.maximized) {
      mainWindow.maximize();
    }

    // these global vars are used in monterey-pal-electron
    global.mainWindow = mainWindow;
    global.rootDir = __dirname;
    global.app = app;
    global.paths = { application_state: '' };
    global.environment = environment;
    global.node_modules = path.join(__dirname, 'node_modules');

    mainWindow.loadURL(getIndex());

    if (isDev()) {
      const electronConnect = require('../node_modules/electron-connect');
      client = electronConnect.client.create(mainWindow);
    }

    let ipcMain = electron.ipcMain;

    ipcMain.on('update:start', () => {
      require('./updater')();
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

    mainWindow.on('close', () => {
      mainWindowState.saveState(mainWindow);
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
        mainWindow.webContents.reloadIgnoringCache();
      }
    }, {
      label: 'Toggle DevTools',
      accelerator: 'Alt+CmdOrCtrl+I',
      click: function() {
        mainWindow.toggleDevTools();
      }
    }, {
      label: 'Logs',
      click: function() {
        shell.showItemInFolder(path.join(app.getPath('userData'), 'logs'));
      }
    }, {
      label: 'Dump session to log',
      click: function() {
        
        const storage = require('electron-json-storage');
        new Promise(resolve => {
          storage.keys(function(error, keys) {
            if (error) throw error;

            resolve(keys);
          });
        }).then(keys => {
          let promises = [];

          for(let x = 0; x < keys.length; x++) {
            promises.push(new Promise(resolve => {
              storage.get(keys[x], (error, data) => {
                if (error) throw error;

                resolve({ key: keys[x], data: data });
              });
            }));
          }
          return Promise.all(promises);
        })
        .then(all => {
          for(let x = 0; x < all.length; x++) {
            if (all[x].key.startsWith('state')) {
              notify(false, 'info', 'info', all[x].data);
            }
          }
          var dialog = electron.dialog;
          dialog.showMessageBox(mainWindow, { type: 'info', message: 'done', buttons: []});    
        }).catch(e => {
          var dialog = electron.dialog;
          dialog.showMessageBox(mainWindow, { type: 'error', message: 'failed: ' + e.message, buttons: []});    
        });
      }
    }, {
      label: 'Start from scratch',
      click: function() {
        if (!confirm('Are you sure? Monterey will start from scratch. This is meant as a last resort.')) {
          return;
        }
        const storage = require('electron-json-storage');
        storage.remove(global.paths.application_state, function (err){});
        mainWindow.loadURL(getIndex());
      },
    }
  ]
}];

function getIndex() {
  return `file://${__dirname}/index.html`;
}

function confirm(message) {
  var dialog = electron.dialog;
  var choice = dialog.showMessageBox(
          mainWindow,
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