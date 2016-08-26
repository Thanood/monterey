import {Logger} from 'aurelia-logging';
import {ELECTRON, OS} from 'monterey-pal';

/*
 * An implementation of the Appender interface.
 */
export class MonteryLogAppender {
  ipcRenderer;

  constructor() {
    this.ipcRenderer = ELECTRON.getIpcRenderer();
  }

  /**
   * Sends csv data to ipc event listener
   *
   * @param args Obj from logger
   */
  send(logger: Logger, level: string, parameters: any[]) {
    // don't log debug messages
    if (level === 'debug') return;

    let msg = '';

    if (parameters && parameters.length > 0) {
      parameters.forEach(param => {
        if (param.message && param.stack) {
         msg = param.message + '   '  + param.stack;
        } else if (typeof param === 'string') {
          msg = msg + '   '  + param;       
        } else {
          msg = msg + '   '  + JSON.stringify(param);
        }
      });
    }

    let logMsg = {
      id: logger.id,
      type: level,
      msg: msg
    };

    this.ipcRenderer.send('log-message', logMsg);
  }

  /**
   * Appends a debug log.
   *
   * @param logger The source logger.
   * @param rest The data to log.
   */
  debug(logger: Logger, ...rest: any[]): void {
    let args = Array.prototype.slice.call(rest);
    this.send(logger, 'debug', args);
  }

  /**
   * Appends an info log.
   *
   * @param logger The source logger.
   * @param rest The data to log.
   */
  info(logger: Logger, ...rest: any[]): void {
    let args = Array.prototype.slice.call(rest);
    this.send(logger, 'info', args);
  }

  /**
   * Appends a warning log.
   *
   * @param logger The source logger.
   * @param rest The data to log.
   */
  warn(logger: Logger, ...rest: any[]): void {
    let args = Array.prototype.slice.call(rest);
    this.send(logger, 'warn', args);
  }

  /**
   * Appends an error log.
   *
   * @param logger The source logger.
   * @param rest The data to log.
   */
  error(logger: Logger, ...rest: any[]): void {
    let args = Array.prototype.slice.call(rest);
    this.send(logger, 'error', args);
  }
}