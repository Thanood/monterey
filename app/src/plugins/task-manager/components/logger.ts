import {bindable, autoinject, BindingEngine, Disposable} from 'aurelia-framework';

@autoinject()
export class Logger {
  @bindable logs;
  logsDiv: Element;
  subscription: Disposable;

  constructor(private bindingEngine: BindingEngine) {
  }

  bind() {
    this.subscription = this.bindingEngine.collectionObserver(this.logs)
      .subscribe(() => this.scrollDown());
  }

  scrollDown() {
    // we don't want to scroll down automatically if the user has scrolled up
    if (this.logsDiv.scrollHeight - this.logsDiv.scrollTop < 350)
      this.logsDiv.scrollTop = this.logsDiv.scrollHeight;
  }

  detached() {
    this.subscription.dispose();
  }
}