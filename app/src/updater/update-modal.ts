import {autoinject, DialogController, I18N, SESSION, Notification, Logger, LogManager} from '../shared/index';
import {Updater} from './updater';

const logger = <Logger>LogManager.getLogger('update-modal');

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

    this.loading = true;
    try {
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
            this.loading = false;
            break;
          case 'checking-for-update':
            msg = 'Checking for update...';
            break;
          case 'update-not-available':
            msg = 'No update available';
              this.loading = false;
            break;
          case 'feed-url':
            msg = `Using feed url: ${args[0]}`;
            break;
        }
        this.logs.push(msg);
        logger.info(msg);
      });
    } catch (e) {
      this.logs.push(`Error: ${e.message}`);
      logger.error(e);
      this.loading = false;
    }
  }
}
