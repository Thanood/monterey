import {IPC} from '../../../src/shared/ipc';

export class IPCFake implements IPC {
  ipcRenderer: any;
  on = jasmine.createSpy('on');
  removeListener = jasmine.createSpy('removeListener');
  removeAllListeners = jasmine.createSpy('removeAllListeners');
  notifyMainOfStart = jasmine.createSpy('notifyMainOfStart');
  send = jasmine.createSpy('send');
}

export * from '../../../src/shared/ipc';