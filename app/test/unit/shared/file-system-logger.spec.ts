import {FileSystemLogger} from '../../../src/shared/file-system-logger';
import {Container}    from 'aurelia-framework';
import {ELECTRON, FS} from 'monterey-pal';

describe('FileSystemLogger', () => {
  let sut: FileSystemLogger;
  let container: Container;

  beforeEach(() => {
    container = new Container();
    ELECTRON.getPath = (p: string) => {
      if (p === 'userData') return 'c:/appdata/monterey';
    };
    FS.join = (...args) => Array.prototype.slice.call(args).join('/');
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
    expect(sut.logFilePath.match(/c:\/appdata\/monterey\/logs\/....-..-..\.csv/).length > 0).toBe(true);
  });

  it ('uses unique file names per day', () => {
    expect(sut.getLogFileName(new Date(2016, 5, 3))).toBe('2016-06-03.csv');
    expect(sut.getLogFileName(new Date(2016, 10, 3))).toBe('2016-11-03.csv');
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
      if (p === 'c:/file.csv') {
        return {
          mtime: new Date().getTime()
        };
      }
    };
    let date = await sut.getModifiedDate('c:/file.csv');
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

  it('removes old logfiles', async (r) => {
    FS.unlink = jasmine.createSpy('FS.unlink');
    FS.readdir = async () => {
      return ['1.csv', 
              '2.csv', 
              '3.csv', 
              '4.csv', 
              '5.csv'
      ];
    }

    sut.getModifiedDate = async (path) => {
      let oldLogs = ['c:/appdata/monterey/logs/1.csv', 'c:/appdata/monterey/logs/2.csv', 'c:/appdata/monterey/logs/3.csv'];
      let oldDate = new Date();
      oldDate.setFullYear(2000);
      if (oldLogs.indexOf(path) > -1) return oldDate;
      else return new Date();
    };

    await sut._cleanupLogs(3);

    expect(FS.unlink).toHaveBeenCalledWith('c:/appdata/monterey/logs/1.csv');
    expect(FS.unlink).toHaveBeenCalledWith('c:/appdata/monterey/logs/2.csv');
    expect(FS.unlink).toHaveBeenCalledWith('c:/appdata/monterey/logs/3.csv');
    expect(FS.unlink).not.toHaveBeenCalledWith('c:/appdata/monterey/logs/4.csv');
    expect(FS.unlink).not.toHaveBeenCalledWith('c:/appdata/monterey/logs/5.csv');

    r();
  });
});