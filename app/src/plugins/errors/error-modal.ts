import {Errors}           from './errors';
import {autoinject}       from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {I18N}             from 'aurelia-i18n';
import {Notification}     from '../../shared/notification';

@autoinject()
export class ErrorModal {
  selectedError: any;
  clipboard: Clipboard;

  constructor(private dialogController: DialogController,
              private notification: Notification,
              private i18n: I18N,
              public errors: Errors) {}

  attached() {
    this.initializeClipboard();

    if (this.errors.errors.length > 0) {
      this.selectedError = this.errors.errors[0];
    }
  }

  clearError() {
    if (this.selectedError) {
      let index = this.errors.errors.indexOf(this.selectedError);
      this.errors.errors.splice(index, 1);

      if (this.errors.errors.length > 0) {
        this.selectedError = this.errors.errors[0];
      } else {
        this.selectedError = undefined;
      }
    }
  }

  initializeClipboard() {
    this.clipboard = new Clipboard('.copy-btn', {
        text: (trigger) => {
          return this.selectedError.stack;
        }
    });

    this.clipboard.on('success', (e) => {
      this.notification.success(this.i18n.tr('copied-error-to-clipboard'));
    });

    this.clipboard.on('error', (e) => {
      this.notification.error(`failed to copy error to clipboard: ${e.text}`);
      console.log(e);
    });
  }
}