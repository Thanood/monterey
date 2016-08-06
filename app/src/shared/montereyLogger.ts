declare var System: any;
import { Logger } from 'aurelia-logging';
const {ipcRenderer} = System._nodeRequire('electron');
/*
 * An implementation of the Appender interface. -> to aurelia and renamed it, ad spit out a object instead
 */
export class MonteryLogAppender {
  /**
   * Sends csv data to ipc evt listener
   *
   * @param args Obj from logger
   */
  send(args: any) {
    ipcRenderer.send('log-message', args);
  }

  /**
   * Appends a debug log.
   *
   * @param logger The source logger.
   * @param rest The data to log.
   */
  debug(logger: Logger, ...rest: any[]): void {
    this.send({
      type: 'debug',
      id: logger.id,
      msg: rest
    });
  }

  /**
   * Appends an info log.
   *
   * @param logger The source logger.
   * @param rest The data to log.
   */
  info(logger: Logger, ...rest: any[]): void {
    this.send({
      type: 'info',
      id: logger.id,
      msg: rest
    });
  }

  /**
   * Appends a warning log.
   *
   * @param logger The source logger.
   * @param rest The data to log.
   */
  warn(logger: Logger, ...rest: any[]): void {
    this.send({
      type: 'warn',
      id: logger.id,
      msg: rest
    });
  }

  /**
   * Appends an error log.
   *
   * @param logger The source logger.
   * @param rest The data to log.
   */
  error(logger: Logger, ...rest: any[]): void {
    this.send({
      type: 'error',
      id: logger.id,
      msg: rest
    });
  }
}
;
