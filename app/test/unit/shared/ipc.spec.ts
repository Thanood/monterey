import {IPC}          from '../../../src/shared/ipc';
import {Container}    from 'aurelia-framework';
import {LogManager}   from 'aurelia-framework';
import {ELECTRON}     from 'monterey-pal';
import {Notification} from '../../../src/shared/notification';

describe('IPC', () => {
  let sut: IPC;
  let ipcRenderer;
  let container: Container;
  let notification;
  let _messageCallback;

  beforeEach(() => {
    container = new Container();
    notification = {};
    container.registerInstance(Notification, notification);
    ipcRenderer = { send: jasmine.createSpy('send'), on: (evt, callback) => _messageCallback = callback };
    ELECTRON.getIpcRenderer = () => ipcRenderer;
    sut = new IPC({
      container: container
    });
  });

  it('notifyMainOfStart sends "monterey-ready" to ipcrenderer', () => {
    sut.notifyMainOfStart();
    expect(ipcRenderer.send).toHaveBeenCalledWith('monterey-ready');
  });

  it('propogates message to logger', () => {
    let warnSpy = jasmine.createSpy('warn');
    LogManager.getLogger = (id) => {
      if (id === 'updater') {
        return {
          warn: warnSpy
        }
      }
    }
    _messageCallback('something happened', false, 'updater', 'warn', 'something happened');
    expect(warnSpy).toHaveBeenCalledWith('something happened');
  });

  it('propogates visible message to notification helper', () => {
    notification.error = jasmine.createSpy('errorSpy');
    LogManager.getLogger = (id) => {
      if (id === 'updater') {
        return {
          warn: () => {}
        }
      }
    }
    _messageCallback('updater errorred', true, 'updater', 'error', 'updater errorred');
    expect(notification.error).toHaveBeenCalledWith('updater errorred');
  });
});