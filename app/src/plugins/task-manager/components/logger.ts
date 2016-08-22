import {bindable} from 'aurelia-framework';

export class Logger {
  @bindable logs = [];
  logsDiv: Element;
  timeout;

  attached() {
    this.timeout = setInterval(() => this.scrollDown(), 300);
    this._scrollDown();
  }

  scrollDown() {
    if (!this.logsDiv) return;

    // we don't want to scroll down automatically if the user has scrolled up
    if (this.logsDiv.scrollHeight - this.logsDiv.scrollTop < 350)
      this._scrollDown();
  }

  _scrollDown() {
    this.logsDiv.scrollTop = this.logsDiv.scrollHeight;
  }

  detached() {
    clearTimeout(this.timeout);
  }
}