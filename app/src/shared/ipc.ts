import {ELECTRON, OS} from 'monterey-pal';
import {LogManager}   from 'aurelia-framework';
import {Notification} from './notification';

export class IPC {
  constructor(aurelia) {
    let ipcRenderer = ELECTRON.getIpcRenderer();
    let notification = <Notification>aurelia.container.get(Notification);

    // the main process sends all messages to the renderer process via the ipcRenderer.
    // this way the render process is in control of what gets logged in the logfile and what's displayed on screen
    ipcRenderer.on('message', (event: string, visible: boolean, id: string, level: string, message: string) => {
      let logger = LogManager.getLogger(id);
      if (visible) {
        if (notification[level]) {
          notification[level](message);
        }
      }
      if (logger[level]) {
        logger[level](message);
      }
    });
  }

  notifyMainOfStart() {
    ELECTRON.getIpcRenderer().send('monterey-ready');
  }
}