import {RandomNumber} from '../../shared/index';

export class Notifications {
  notifications: Array<Notification> = [];

  add(notification: Notification) {
    notification.id = new RandomNumber().create();
    notification.created = new Date();
    this.notifications.push(notification);
  }
}

export interface Notification {
  /**
   * Unique identifier of a notification
   */
  id?: number;

  /**
   * Icon of the notification (fa fa-remove)
   */
  icon?: string;

  /**
   * Short title of the notification
   */
  title: string;

  /**
   * Markdown string, can be used instead of viewModel
   */
  body?: string;

  /**
   * When was the notification created
   */
  created?: Date;

  /**
   * The viewModel which will be used for `<compose>`. Can be used
   * instead of the `body`
   */
  viewModel?: string;

  /**
   * Model which will be used for `<compose>`, only needed when providing a `viewModel`
   */
  model?: any;
}