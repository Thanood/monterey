import {LogManager} from 'aurelia-framework';

class TestAppender {
    debug = jasmine.createSpy('debug');
    info = jasmine.createSpy('info');
    warn = jasmine.createSpy('warn');
    error = jasmine.createSpy('error');
}

export let logger = new TestAppender();

let added = false;

export function configureLogger() {
  logger.debug.calls.reset();
  logger.info.calls.reset();
  logger.warn.calls.reset();
  logger.error.calls.reset();

  if (!added) {
    LogManager.addAppender(logger);
    LogManager.setLevel(LogManager.logLevel.debug);

    added = true;
  }
}