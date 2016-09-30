import {Notification} from '../../../src/shared/notification';

export class NotificationFake implements Notification {
  logger: any;
  _toastr: any;
  info = jasmine.createSpy('info');
  warning = jasmine.createSpy('warning');
  debug = jasmine.createSpy('debug');
  error = jasmine.createSpy('error');
  success = jasmine.createSpy('success');
}

export * from '../../../src/shared/notification';