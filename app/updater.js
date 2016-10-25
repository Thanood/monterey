const electron = require('electron');
const BrowserWindowElectron = electron.BrowserWindow;
const WebContents = BrowserWindowElectron.WebContents;
const app = electron.app;
const autoUpdater = electron.autoUpdater;
const os = require('os');
const UPDATE_SERVER_HOST = 'nuts.jeroenvinke.nl:443'

const key = 'update:message';

module.exports = function update () {
  autoUpdater.addListener('update-available', (event) => {
    sendMsg(key, 'update-available');
  });
  autoUpdater.addListener('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateURL) => {
    sendMsg(key, 'update-downloaded', releaseNotes, releaseName, releaseDate, updateURL);
  });
  autoUpdater.addListener('error', (error) => {
    sendMsg(key, 'error', error.message);
  });
  autoUpdater.addListener('checking-for-update', (event) => {
    sendMsg(key, 'checking-for-update', event);
  });
  autoUpdater.addListener('update-not-available', () => {
    sendMsg(key, 'update-not-available');
  });

  let feedURL = `https://${UPDATE_SERVER_HOST}/update/${os.platform()}/${os.platform() === 'darwin' ? '?version=' + version : ''}`;
  sendMsg(key, 'feed-url', feedURL);
  autoUpdater.setFeedURL(feedURL);
  autoUpdater.checkForUpdates();
}

function sendMsg(key, ...params) {
  let windows = BrowserWindowElectron.getAllWindows();
  if (windows.length == 0) {
    return;
  }

  params.unshift(key);
  windows[0].webContents.send.apply(windows[0].webContents, params);
}