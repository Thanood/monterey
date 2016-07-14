const electron = require('electron');
const app = electron.app;
const autoUpdater = electron.autoUpdater;
const BrowserWindowElectron = electron.BrowserWindow;
const os = require('os');
const WebContents = BrowserWindowElectron.WebContents;

const UPDATE_SERVER_HOST = 'nuts.jeroenvinke.nl:8081'

module.exports = function update (window) {
  if (os.platform() !== 'darwin') {
    return
  }

  const version = app.getVersion()
  autoUpdater.addListener('update-available', (event) => {
    console.log('A new update is available')
  })
  autoUpdater.addListener('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateURL) => {
    notify('A new update is ready to install', `Version ${releaseName} is downloaded and will be automatically installed on Quit`)
  })
  autoUpdater.addListener('error', (error) => {
    console.log(error)
  })
  autoUpdater.addListener('checking-for-update', (event) => {
    console.log('checking-for-update')
  })
  autoUpdater.addListener('update-not-available', () => {
    console.log('update-not-available')
  })
  autoUpdater.setFeedURL(`https://${UPDATE_SERVER_HOST}/update/${os.platform()}_${os.arch()}/${version}`)

  window.webContents.once('did-frame-finish-load', (event) => {
    autoUpdater.checkForUpdates()
  })
}

function notify(title, message) {
  let windows = BrowserWindowElectron.getAllWindows()
  if (windows.length == 0) {
    return
  }

  windows[0].webContents.send('notify', title, message)
}