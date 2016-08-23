import {GlobalExceptionHandler} from '../../src/global-exception-handler';
import {Errors}                 from '../../src/plugins/errors/errors';
import {Container}              from 'aurelia-framework';
import {LogManager}             from 'aurelia-framework';

describe('GlobalExceptionHandler', () => {
  let sut: GlobalExceptionHandler;
  let ea;
  let errors;
  let container: Container;

  beforeEach(() => {
    container = new Container();
    errors = { add: jasmine.createSpy('errors add') };
    container.registerInstance(Errors, errors);
    sut = new GlobalExceptionHandler({
      container: container
    });
  });

  it('logs uncaught error to console', () => {
    let spy = spyOn(console, 'log');
    let error = new Error('something went wrong');
    window.onerror('something went wrong', 'somefile.ts', 15, 23, error);
    expect(spy).toHaveBeenCalledWith(error);
  });

  it('registers error in Errors object', () => {
    let error = new Error('something went wrong');
    window.onerror('something went wrong', 'somefile.ts', 15, 23, error);
    expect(errors.add).toHaveBeenCalledWith(error);
  });

  it('passes error to aurelia-logger', () => {
    let logger = { error: jasmine.createSpy('logger.error') };
    LogManager.getLogger = () => logger;
    let error = new Error('something went wrong');
    window.onerror('something went wrong', 'somefile.ts', 15, 23, error);
    expect(logger.error).toHaveBeenCalledWith(error);
  });

  it('logs uncaught promise rejections to console', () => {
    let spy = spyOn(console, 'log');
    let evt = document.createEvent('Event');
    evt.initEvent('unhandledrejection', true, true);
    window.dispatchEvent(evt);
    expect(spy).toHaveBeenCalledWith(evt);
  });

  it('registers uncaught promise rejections on errors object', () => {
    let evt = document.createEvent('Event');
    evt.initEvent('unhandledrejection', true, true);
    (<any>evt).reason = {
      message: 'something went wrong',
      stack: 'some function did it'
    };
    window.dispatchEvent(evt);
    expect(errors.add).toHaveBeenCalledWith({ message: 'something went wrong', stack: 'some function did it' });
  });

  it('logs uncaught promise rejections to console', () => {
    let logger = { error: jasmine.createSpy('logger.error') };
    LogManager.getLogger = () => logger;
    let evt = document.createEvent('Event');
    evt.initEvent('unhandledrejection', true, true);
    window.dispatchEvent(evt);
    expect(logger.error).toHaveBeenCalledWith(evt);
  });
});