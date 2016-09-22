import * as toastr from 'toastr';
import {LogManager}             from 'aurelia-framework';
import {Logger}                 from 'aurelia-logging';

const logger = <Logger>LogManager.getLogger('notification');

/**
 * Uses Toastr to render notifications on screen.
 */
export class Notification {
  info(message: string, title: string = undefined, overrides: ToastrOptions = undefined) {
    toastr.info(message, title, overrides);
    logger.info(message);
  }
  error(message: string, title: string = undefined, overrides: ToastrOptions = undefined) {
    if (!overrides) {
      overrides = {
        timeOut: 0,
        extendedTimeOut: 0,
        closeButton: true
      };
    }
    toastr.error(message, title, overrides);
    logger.error(message);
  }
  warning(message: string, title: string = undefined, overrides: ToastrOptions = undefined) {
    toastr.warning(message, title, overrides);
    logger.warn(message);
  }
  success(message: string, title: string = undefined, overrides: ToastrOptions = undefined) {
    toastr.success(message, title, overrides);
    logger.info(message);
  }
}