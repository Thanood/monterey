import {MonteryLogAppender} from '../../../src/shared/monterey-logger';
import {FileSystemLogger}   from '../../../src/shared/file-system-logger';
import {Container}      from 'aurelia-framework';

describe('MonteryLogAppender', () => {
  let sut: MonteryLogAppender;
  let container: Container;
  let fsLogger: FileSystemLogger;

  beforeEach(() => {
    container = new Container();
    this.fsLogger = <any>{};
    container.registerInstance(FileSystemLogger, this.fsLogger);
    sut = container.get(MonteryLogAppender);
  });

  it('does not log debug messages', () => {
    this.fsLogger.writeToBuffer = jasmine.createSpy('writeToBuffer');
    sut.send(<any>{}, 'debug', ['hello world']);

    expect(this.fsLogger.writeToBuffer).not.toHaveBeenCalled();
  });

  it('takes message and stack of any object', () => {
    // error and stacktrace are often nonserializable getter properties

    this.fsLogger.writeToBuffer = jasmine.createSpy('writeToBuffer');
    sut.send(<any>{ id: 'test' }, 'info', [{ message: 'foo', stack: 'bar'}]);

    expect(this.fsLogger.writeToBuffer).toHaveBeenCalledWith('info', 'test', 'foo, bar');
  });

  it('concatenates parameters into a single message', () => {
    this.fsLogger.writeToBuffer = jasmine.createSpy('writeToBuffer');
    sut.send(<any>{ id: 'test' }, 'info', ['foo', 'bar']);

    expect(this.fsLogger.writeToBuffer).toHaveBeenCalledWith('info', 'test', 'foo, bar');
  });

  it('serializes objects', () => {
    this.fsLogger.writeToBuffer = jasmine.createSpy('writeToBuffer');
    sut.send(<any>{ id: 'test' }, 'info', [{ some: 'object' }]);

    expect(this.fsLogger.writeToBuffer).toHaveBeenCalledWith('info', 'test', '{"some":"object"}');
  });
});