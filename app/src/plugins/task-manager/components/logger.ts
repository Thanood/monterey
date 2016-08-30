import {bindable} from 'aurelia-framework';

export class Logger {
  @bindable logs;
  title = 'Output';
  logsDiv: Element;
  @bindable autoScroll = true;
  timeout: any;

  bind() {
    this.timeout = setInterval(() => this.scrollDown(), 300);
  }

  scrollDown() {
    if (this.autoScroll) {
      this.logsDiv.scrollTop = this.logsDiv.scrollHeight;
    }
  }

  detached() {
    clearInterval(this.timeout);
  }
}