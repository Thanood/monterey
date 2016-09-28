import * as toastr  from 'toastr';
import {LogManager} from 'aurelia-framework';
import {Logger}     from 'aurelia-logging';

/**
 * Uses Toastr to render notifications on screen.
 */
export class Notification {
  logger: Logger;

  constructor() {
    this.logger = LogManager.getLogger('notification');
  }

  info(message: string, title: string = undefined, overrides: ToastrOptions = undefined) {
    this._toastr('info', message, title, overrides);
    this.logger.info(message);
  }
  error(message: string, title: string = undefined, overrides: ToastrOptions = undefined) {
    if (!overrides) {
      overrides = {
        timeOut: 0,
        extendedTimeOut: 0,
        closeButton: true
      };
    }
    this._toastr('error', message, title, overrides);
    this.logger.error(message);
  }
  warning(message: string, title: string = undefined, overrides: ToastrOptions = undefined) {
    this._toastr('warning', message, title, overrides);
    this.logger.warn(message);
  }
  success(message: string, title: string = undefined, overrides: ToastrOptions = undefined) {
    this._toastr('success', message, title, overrides);
    this.logger.info(message);
  }

  _toastr(level: string, msg: string, title: string, params: any) {
    toastr[level](msg, title, params);
  }
}