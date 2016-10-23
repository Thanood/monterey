import {Messages, Message} from './messages';
import {Notification, autoinject, I18N, DialogController, observable} from '../../shared/index';
import * as showdown from 'showdown';

@autoinject()
export class MessageModal {
  @observable selectedMessage: Message;

  constructor(private dialogController: DialogController,
              private notification: Notification,
              private i18n: I18N,
              public messages: Messages) {}

  attached() {
    if (this.messages.messages.length > 0) {
      this.selectedMessage = this.messages.messages[0];
    }
  }

  selectedNotificationChanged() {
    if (this.selectedMessage.body) {
      let converter = new showdown.Converter();
      let notification = <any>this.selectedMessage;
      notification.html = converter.makeHtml(notification.body);
    }
  }
}