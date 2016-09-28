import {FileSystemLogger} from '../../../src/shared/file-system-logger';
import {Container}    from 'aurelia-framework';
import {ELECTRON, FS} from 'monterey-pal';
import {Settings} from '../../../src/shared/settings';

describe('FileSystemLogger', () => {
  let sut: FileSystemLogger;
  let container: Container;
  let settings: Settings;

  beforeEach(() => {
    container = new Container();
    settings = container.get(Settings);
    ELECTRON.getPath = (p: string) => {
      if (p === 'userData') return 'c:/appdata/monterey';
    };
    FS.join = (...args) => Array.prototype.slice.call(args).join('/');
    FS.access = (p: any, x: any) => Promise.resolve(true);
    FS.getConstants = () => {
      return {
        W_OK: true,
        R_OK: true
      };
    };
    sut = container.get(FileSystemLogger);
  });

  afterEach(() => {
    clearTimeout(sut.timeout);
  });

  it ('gets correct log folder path', () => {
    expect(sut.logFolder).toBe('c:/appdata/monterey/logs');
  });

  it ('sets logFilePath', () => {
    let date = new Date();
    expect(sut.logFilePath.match(/c:\/appdata\/monterey\/logs\/....-..-..\.txt/).length > 0).toBe(true);
  });

  it ('uses unique file names per day', () => {
    expect(sut.getLogFileName(new Date(2016, 5, 3))).toBe('2016-06-03.txt');
    expect(sut.getLogFileName(new Date(2016, 10, 3))).toBe('2016-11-03.txt');
  });

  it ('creates logfolder if it doesn\'t exist', async (r) => {
    spyOn(sut, 'fileOrFolderExists').and.returnValue(Promise.resolve(false));
    FS.mkdir = jasmine.createSpy('FS.mkdir');
    await sut.verifyLogPathAndFile();
    expect(FS.mkdir).toHaveBeenCalledWith(sut.logFolder)
    r();
  });

  it ('creates logfile if it doesn\'t exist', async (r) => {
    spyOn(sut, 'fileOrFolderExists').and.returnValue(Promise.resolve(false));
    let appendToFile = spyOn(sut, 'appendToFile').and.returnValue(Promise.resolve());

    await sut.verifyLogPathAndFile();
    expect(appendToFile).toHaveBeenCalledWith(sut.logFilePath, 'type,id,date,msg');
    r();
  });

  it('getModifiedDate returns correct date', async (r) => {
    FS.stat = async (p) => {
      if (p === 'c:/file.txt') {
        return {
          mtime: new Date().getTime()
        };
      }
    };
    let date = await sut.getModifiedDate('c:/file.txt');
    expect(date.getFullYear()).toBe(new Date().getFullYear());
    expect(date.getMonth()).toBe(new Date().getMonth());
    expect(date.getDay()).toBe(new Date().getDay());
    r();
  });

  it('does not flush buffer when buffer is empty', async (r) => {
    let appendToFile = spyOn(sut, 'appendToFile');
    let addFlushDelay = spyOn(sut, 'addFlushDelay');
    sut.buffer = '';
    await sut.flushBuffer();
    expect(addFlushDelay).toHaveBeenCalled();
    expect(appendToFile).not.toHaveBeenCalled();
    r();
  });

  it('clears buffer after persisting it', async (r) => {
    let addFlushDelay = spyOn(sut, 'addFlushDelay');
    sut.buffer = 'some buffer content';
    await sut.flushBuffer();
    expect(addFlushDelay).toHaveBeenCalled();
    expect(sut.buffer).toBe('');
    r();
  });

  it('uses csv format for the messages', () => {
    sut.buffer = '';
    sut.writeToBuffer('warn', 'some-module', 'something happened');
    expect(sut.buffer.match(/"warn","some-module",".*","something happened"\r\n/g).length > 0).toBe(true);
  });

  it('handles that buffer may have been changed during flush of previous buffer', (r) => {
    let _resolve;
    sut.buffer = 'test\r\n';
    sut.appendToFile = jasmine.createSpy('appendToFile').and.returnValue(new Promise(resolver => _resolve = resolver));
    let promise = sut.flushBuffer();

    sut.buffer = 'test\r\nsome message that came in during flush';

    _resolve();

    promise.then(() => {
      expect(sut.buffer).toBe('some message that came in during flush');
      r();
    });
  });

  it('removes old logfiles', async (r) => {
    FS.unlink = jasmine.createSpy('FS.unlink');
    FS.readdir = async () => {
      return ['1.txt',
              '2.txt',
              '3.txt',
              '4.txt',
              '5.txt'
      ];
    }

    sut.getModifiedDate = async (path) => {
      let oldLogs = ['c:/appdata/monterey/logs/1.txt', 'c:/appdata/monterey/logs/2.txt', 'c:/appdata/monterey/logs/3.txt'];
      let oldDate = new Date();
      oldDate.setFullYear(2000);
      if (oldLogs.indexOf(path) > -1) return oldDate;
      else return new Date();
    };

    await sut._cleanupLogs(3);

    expect(FS.unlink).toHaveBeenCalledWith('c:/appdata/monterey/logs/1.txt');
    expect(FS.unlink).toHaveBeenCalledWith('c:/appdata/monterey/logs/2.txt');
    expect(FS.unlink).toHaveBeenCalledWith('c:/appdata/monterey/logs/3.txt');
    expect(FS.unlink).not.toHaveBeenCalledWith('c:/appdata/monterey/logs/4.txt');
    expect(FS.unlink).not.toHaveBeenCalledWith('c:/appdata/monterey/logs/5.txt');

    r();
  });

  it('does not clean up logfiles when the cleanup-logs is false', async (r) => {
    spyOn(settings, 'getValue').and.returnValue(false);
    let spy = spyOn(sut, '_cleanupLogs');
    await sut.cleanupLogs();
    expect(spy).not.toHaveBeenCalled();

    r();
  });

  it('cleas up logfiles when the cleanup-logs is true', async (r) => {
    spyOn(settings, 'getValue').and.returnValue(true);
    let spy = spyOn(sut, '_cleanupLogs');
    await sut.cleanupLogs();
    expect(spy).toHaveBeenCalled();

    r();
  });

  it('checks for read and write access before creating file or folder', async (r) => {
    let spy = spyOn(FS, 'access');
    spyOn(FS, 'getConstants').and.returnValue({ R_OK: true, W_OK: true });
    await sut.fileOrFolderExists('c:/test');

    expect(spy).toHaveBeenCalledWith('c:/test', true);

    r();
  });

  it('logs that monterey has started', async (r) => {
    let spy = spyOn(sut, 'writeToBuffer');

    await sut.activate();

    expect(spy).toHaveBeenCalledWith('info', 'monterey', 'application started');

    r();
  });

  it('activates flush delay', async (r) => {
    let spy = spyOn(sut, 'addFlushDelay');

    await sut.activate();

    expect(spy).toHaveBeenCalled();

    r();
  });

  it('verifies (and creates) log file on activate', async (r) => {
    let spy = spyOn(sut, 'verifyLogPathAndFile');

    await sut.activate();

    expect(spy).toHaveBeenCalled();

    r();
  });
});