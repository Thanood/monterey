const electron = require('electron');
const app = electron.app;
const autoUpdater = electron.autoUpdater;
const BrowserWindowElectron = electron.BrowserWindow;
const os = require('os');
const WebContents = BrowserWindowElectron.WebContents;

const UPDATE_SERVER_HOST = 'nuts.jeroenvinke.nl:443'

module.exports = function update (window) {
  const version = app.getVersion();
  autoUpdater.addListener('update-available', (event) => {
    notify(false, 'info', 'updater', 'A new update is available');
  });
  autoUpdater.addListener('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateURL) => {
    notify(true, 'success', 'updater', `Version ${releaseName} is downloaded and will be automatically installed on Quit`);
  });
  autoUpdater.addListener('error', (error) => {
    notify(true, 'error', 'updater', error);
  });
  autoUpdater.addListener('checking-for-update', (event) => {
    notify(false, 'info', 'updater', 'checking-for-update');
  });
  autoUpdater.addListener('update-not-available', () => {
    notify(false, 'info', 'updater', 'update-not-available');
  });
  autoUpdater.setFeedURL(`https://${UPDATE_SERVER_HOST}/update/${os.platform()}_${os.arch()}/${version}`)

  window.webContents.once('did-frame-finish-load', (event) => {
    autoUpdater.checkForUpdates();
  });
}

function notify(visible, level, id, message) {
  let windows = BrowserWindowElectron.getAllWindows();
  if (windows.length == 0) {
    return;
  }

  // send this message to the ipcListener so the renderer process can handle it
  windows[0].webContents.send('message', visible, level, id, message);
}