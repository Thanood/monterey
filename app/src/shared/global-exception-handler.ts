import {LogManager}                      from 'aurelia-framework';
import {Errors}                          from '../plugins/errors/errors';

export class GlobalExceptionHandler {
  constructor(aurelia) {
    let errors = <Errors>aurelia.container.get(Errors);

    // catch all uncatched errors in the renderer process
    window.onerror = (message: string, filename?: string, lineno?: number, colno?: number, error?: Error) => {
      let logger = LogManager.getLogger('global exception');
      console.log(error);
      errors.add(error);
      logger.error(error);
    };

    // catch all unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event: any) {
      let logger = LogManager.getLogger('global exception');
      console.log(event);
      if (event.reason) {
        errors.add({message: event.reason.message, stack: event.reason.stack });
      }
      logger.error(event);
    });
  }
}