import {autoinject}       from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {Notification}     from '../../shared/index';

@autoinject()
export class ShareModal {
  launcher;
  clipboard: Clipboard;
  issueText: Element;

  constructor(private dialogController: DialogController,
              private notification: Notification) {}

  activate(launcher) {
    this.launcher = launcher;
  }

  attached() {
    this.initializeClipboard();
  }

  initializeClipboard() {
    this.clipboard = new Clipboard('.copy-btn', {
        text: (trigger) => {
          return $(this.issueText).text();
        }
    });

    this.clipboard.on('success', (e) => {
      this.notification.success('copied text to clipboard');
    });

    this.clipboard.on('error', (e) => {
      this.notification.error(`failed to copy text to clipboard: ${e.text}`);
      console.log(e);
    });
  }
}

export class DashifyValueConverter {
  toView(text) {
    if (!text) return '';

    return text.replace(/\s+/g, '-').toLowerCase();
  }
}