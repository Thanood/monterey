import {autoinject, DialogController, I18N, SESSION, Notification} from '../shared/index';
import {Updater} from './updater';

@autoinject()
export class UpdateModal {
  error: string;
  logs: Array<string> = [];
  loading = false;

  constructor(private dialogController: DialogController,
              private i18n: I18N,
              private notification: Notification,
              private updater: Updater) {
  }

  attached() {
    this.start();
  }

  async start() {
    // if (SESSION.getEnv() === 'development') {
    //   this.error = 'Development mode detected, not going to update';
    //   return false;
    // }


    // autoUpdater.addListener('update-available', (event) => {
    //   eventCallback('update-available');
    // });
    // autoUpdater.addListener('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateURL) => {
    //   eventCallback('update-downloaded', releaseNotes, releaseName, releaseDate, updateURL);
    // });
    // autoUpdater.addListener('error', (error) => {
    //   eventCallback('error', error);
    // });
    // autoUpdater.addListener('checking-for-update', (event) => {
    //   eventCallback('checking-for-update', event);
    // });
    // autoUpdater.addListener('update-not-available', () => {
    //   eventCallback('update-not-available');


    this.loading = true;
    this.updater.update((event, ...args) => {
      let msg = event;
      switch (event) {
        case 'update-available':
          msg = 'Update available. Downloading now...';
          break;
        case 'update-downloaded':
          msg = 'Update downloaded. It will be installed on quit';
          break;
        case 'error':
          msg = `Error: ${JSON.stringify(args[0])}`;
          break;
        case 'checking-for-update':
          msg = 'Checking for update...';
          break;
        case 'update-not-available':
          msg = 'No update available';
          break;
        case 'feed-url':
          msg = `Using feed url: ${args[0]}`;
          break;
      }
      this.logs.push(msg);
    });
    this.loading = false;
  }
}
