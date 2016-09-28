import {Notification}  from '../../../src/shared/notification';
import {Container, LogManager} from 'aurelia-framework';
import {Logger} from 'aurelia-logging';

describe('Notification', () => {
  let sut: Notification;
  let container: Container;
  let logger: any;

  beforeEach(() => {
    container = new Container();
    logger = {
      error: jasmine.createSpy('logger.error'),
      info: jasmine.createSpy('logger.info'),
      warn: jasmine.createSpy('logger.warn'),
      success: jasmine.createSpy('logger.success')
    };
    LogManager.getLogger = () => logger;
    sut = container.get(Notification);
  });

  it('does not hide error messages', () => {
    spyOn(sut, '_toastr');
    sut.error('hello world');
    expect(sut._toastr).toHaveBeenCalledWith('error', 'hello world', undefined, { timeOut: 0, extendedTimeOut: 0, closeButton: true });
  });

  it('passes parameters to toastr', () => {
    spyOn(sut, '_toastr');
    sut.error('foo', 'foo', { toastClass: 'foo' });
    sut.info('bar', 'bar', { toastClass: 'bar' });
    sut.warning('baz', 'baz', { toastClass: 'baz' });
    sut.success('foobar', 'foobar', { toastClass: 'foobar' });

    expect(sut._toastr).toHaveBeenCalledWith('error', 'foo', 'foo', { toastClass: 'foo' });
    expect(sut._toastr).toHaveBeenCalledWith('info', 'bar', 'bar', { toastClass: 'bar' });
    expect(sut._toastr).toHaveBeenCalledWith('warning', 'baz', 'baz', { toastClass: 'baz' });
    expect(sut._toastr).toHaveBeenCalledWith('success', 'foobar', 'foobar', { toastClass: 'foobar' });
  });

  it('logs all messages', () => {
    sut.error('foo');
    sut.info('bar');
    sut.warning('baz');
    sut.success('foobar');

    expect(logger.error).toHaveBeenCalled();

    // once for success, once for info
    expect(logger.info).toHaveBeenCalledTimes(2);
    expect(logger.warn).toHaveBeenCalled();
  });
});