import {Notifications}     from './notifications';
import {NotificationModal} from './notification-modal';
import {withModal, autoinject, useView, BindingEngine, Disposable} from '../../shared/index';

@useView('../task-bar/default-item.html')
@autoinject()
export class TaskBar {
  text: string;
  visible: boolean;
  subscription: Disposable;
  icon = 'fa fa-bell-o';

  constructor(private notifications: Notifications,
              private bE: BindingEngine) {
    this.subscription = bE.collectionObserver(notifications.notifications).subscribe(() => this.update());
    this.update();
  }

  update() {
    let notificationsCount = this.notifications.notifications.length;
    this.text = '' + notificationsCount;
    this.visible = notificationsCount > 0;
  }

  @withModal(NotificationModal)
  onClick() {}

  detached() {
    this.subscription.dispose();
  }
}