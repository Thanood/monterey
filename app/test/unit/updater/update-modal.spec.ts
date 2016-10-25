import {UpdateModal}    from '../../../src/updater/update-modal';
import {SESSION}        from 'monterey-pal';
import {Container}      from 'aurelia-dependency-injection';
import {IPC, IPCFake, Updater, UpdaterFake} from '../fakes/index';
import '../setup';

describe('UpdateModal', () => {
  let sut: UpdateModal;
  let container: Container;

  beforeEach(() => {
    container = new Container();
    container.registerSingleton(IPC, IPCFake);
    container.registerSingleton(Updater, UpdaterFake);

    spyOn(SESSION, 'getEnv').and.returnValue('production');

    sut = container.get(UpdateModal);
  });

  it('starts on attached()', () => {
    spyOn(sut, 'start');
    sut.attached();
    expect(sut.start).toHaveBeenCalled();
  });

  it('start calls the updater module', () => {
    sut.loading = false;
    let updater = container.get(Updater);
    sut.start();
    expect(updater.update).toHaveBeenCalled();
    expect(sut.loading).toBe(true);
  });

  it('listens for "update:message"', () => {
    let ipc = container.get(IPC);
    sut.start();
    expect(ipc.on).toHaveBeenCalledWith('update:message', jasmine.anything());
  });

  it('unlistens "update:message"', () => {
    let ipc = container.get(IPC);
    sut.detached();
    expect(ipc.removeAllListeners).toHaveBeenCalledWith('update:message');
  });

  it('adds messages to the screen', () => {
    let ipc = container.get(IPC);
    sut.handleMessage(null, 'update-available');
    sut.handleMessage(null, 'update-downloaded');
    sut.handleMessage(null, 'error');
    sut.handleMessage(null, 'checking-for-update');
    sut.handleMessage(null, 'update-not-available');

    expect(sut.logs.length).toBe(5);

    // error, update-not-available and update-downloaded should stop the update process
    // and therefore remove the listener for further messages
    expect(ipc.removeAllListeners).toHaveBeenCalledWith('update:message');
    expect(ipc.removeAllListeners).toHaveBeenCalledTimes(3);
  });
});