import {Notifications, Notification} from './notifications';
import {Notification as NotificationUtil, autoinject, I18N, DialogController, observable} from '../../shared/index';
import * as showdown from 'showdown';

@autoinject()
export class NotificationModal {
  @observable selectedNotification: Notification;

  constructor(private dialogController: DialogController,
              private notification: NotificationUtil,
              private i18n: I18N,
              public notifications: Notifications) {}

  attached() {
    if (this.notifications.notifications.length > 0) {
      this.selectedNotification = this.notifications.notifications[0];
    }
  }

  selectedNotificationChanged() {
    if (this.selectedNotification.body) {
      let converter = new showdown.Converter();
      let notification = <any>this.selectedNotification;
      notification.html = converter.makeHtml(notification.body);
    }
  }
}