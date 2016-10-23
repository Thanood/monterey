import {Notifications, Notification} from '../../../src/plugins/notifications/notifications';

export class NotificationsFake implements Notifications {
  notifications: Array<Notification> = [];

  add = jasmine.createSpy('add');
}

export * from '../../../src/plugins/notifications/notifications';