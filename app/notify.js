const electron = require('electron');
const BrowserWindowElectron = electron.BrowserWindow;
const WebContents = BrowserWindowElectron.WebContents;

module.exports = function notify(visible, level, id, message) {
  let windows = BrowserWindowElectron.getAllWindows();
  if (windows.length == 0) {
    return;
  }

  // send this message to the ipcListener so the renderer process can handle it
  windows[0].webContents.send('message', visible, id, level, message);
}