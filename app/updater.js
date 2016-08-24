const electron = require('electron');
const app = electron.app;
const autoUpdater = electron.autoUpdater;
const os = require('os');
const notify = require('./notify');

const UPDATE_SERVER_HOST = 'nuts.jeroenvinke.nl:443'

module.exports = function update (window) {
  const version = app.getVersion();

  notify(false, 'info', 'updater', `current version: ${version}`);

  autoUpdater.addListener('update-available', (event) => {
    notify(false, 'info', 'updater', 'A new update is available');
  });
  autoUpdater.addListener('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateURL) => {
    notify(true, 'success', 'updater', `Version ${releaseName} has been downloaded and will be automatically installed on Quit`);
  });
  autoUpdater.addListener('error', (error) => {
    notify(false, 'info', 'updater', `Error: Failed to update: ${error}`);
  });
  autoUpdater.addListener('checking-for-update', (event) => {
    notify(false, 'info', 'updater', 'checking-for-update');
  });
  autoUpdater.addListener('update-not-available', () => {
    notify(false, 'info', 'updater', 'update-not-available');
  });

  let feedURL = `https://${UPDATE_SERVER_HOST}/update/${os.platform()}/`;
  notify(false, 'info', 'updater', `using update feed url: ${feedURL}`);
  autoUpdater.setFeedURL(feedURL);

  notify(false, 'info', 'updater', 'checking for updates now');
  autoUpdater.checkForUpdates();
}

