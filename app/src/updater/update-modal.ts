import {autoinject, DialogController, I18N, SESSION, Notification, Logger, LogManager, IPC} from '../shared/index';
import {Updater} from './updater';

const logger = <Logger>LogManager.getLogger('update-modal');

/**
 * The `UpdateModal` is the dialog that instructs the Updater module
 * to update, and displays all messages on screen with a spinner
 */
@autoinject()
export class UpdateModal {
  error: string;
  logs: Array<string> = [];
  loading = false;

  constructor(private dialogController: DialogController,
              private i18n: I18N,
              private notification: Notification,
              private updater: Updater,
              private ipc: IPC) {
  }

  attached() {
    this.start();

    if (SESSION.getEnv() === 'development') {
      this.logs.push('You are currently in development mode. This means that Squirrel (the update module) is not available and that it will fail to update');
    }
  }

  listen() {
    this.ipc.on('update:message', this.handleMessage.bind(this));
  }

  unlisten() {
    this.ipc.removeAllListeners('update:message');
  }

  handleMessage(e, key, ...params) {
    let msg;

    switch (key) {
      case 'update-available':
        msg = 'Update available. Downloading now...';
        break;
      case 'update-downloaded':
        msg = 'Update downloaded. It will be installed on quit';
        break;
      case 'error':
        msg = `Error: ${JSON.stringify(params[0])}`;
        break;
      case 'checking-for-update':
        msg = 'Checking for update...';
        break;
      case 'update-not-available':
        msg = 'No update available';
        break;
    }

    // We're done whenever we get one of the following messages from
    // the auto-updater
    switch (key) {
      case 'update-downloaded':
      case 'error':
      case 'update-not-available':
        this.unlisten();
        this.loading = false;
        break;
    }

    if (msg) {
      this.logs.push(msg);
      logger.info(msg);
    } else {
      logger.info(key);
    }
  }

  start() {
    this.unlisten();
    this.listen();
    this.loading = true;
    this.updater.update();
  }

  detached() {
    this.unlisten();
  }
}
