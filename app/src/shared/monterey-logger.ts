import {autoinject} from 'aurelia-framework';
import {Logger} from 'aurelia-logging';
import {FileSystemLogger} from './file-system-logger';

/*
 * `MontereyLogAppender` is an adapter of aurelia-logging, and logs messages to the console and it
 * passes msesages to the `FileSystemLogger`
 */
@autoinject()
export class MonteryLogAppender {

  constructor(private fsLogger: FileSystemLogger) {}

  /**
   * Write message to file system logger
   *
   * @param args Obj from logger
   */
  send(logger: Logger, level: string, parameters: any[]) {
    // don't log debug messages
    if (level === 'debug') return;

    let msgParts = [];

    if (parameters && parameters.length > 0) {
      parameters.forEach(param => {
        if (param.message && param.stack) {
         msgParts.push(param.message + ', '  + param.stack);
        } else if (typeof param === 'object') {
          msgParts.push(JSON.stringify(param));
        } else {
          msgParts.push(param);
        }
      });
    }

    this.fsLogger.writeToBuffer(level, logger.id, msgParts.join(', '));
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