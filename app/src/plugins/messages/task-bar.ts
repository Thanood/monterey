import {Messages}     from './messages';
import {MessageModal} from './message-modal';
import {withModal, autoinject, useView, BindingEngine, Disposable} from '../../shared/index';

@useView('../task-bar/default-item.html')
@autoinject()
export class TaskBar {
  text: string;
  visible: boolean;
  subscription: Disposable;
  icon = 'fa fa-bell-o';

  constructor(private messages: Messages,
              private bE: BindingEngine) {
    this.subscription = bE.collectionObserver(messages.messages).subscribe(() => this.update());
    this.update();
  }

  update() {
    let messagesCount = this.messages.messages.length;
    this.text = '' + messagesCount;
    this.visible = messagesCount > 0;
  }

  @withModal(MessageModal)
  onClick() {}

  detached() {
    this.subscription.dispose();
  }
}