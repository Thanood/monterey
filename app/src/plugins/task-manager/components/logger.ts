import {bindable, autoinject, BindingEngine, Disposable} from 'aurelia-framework';

@autoinject()
export class Logger {
  @bindable logs;
  title = 'Output';
  logsDiv: Element;
  subscription: Disposable;

  constructor(private bindingEngine: BindingEngine) {
  }

  bind() {
    this.subscription = this.bindingEngine.collectionObserver(this.logs)
      .subscribe(() => setTimeout(() => this.scrollDown()));
  }

  scrollDown() {
    // we don't want to scroll down automatically if the user has scrolled up
    let distanceFromBottom = this.logsDiv.scrollHeight - this.logsDiv.scrollTop - this.logsDiv.clientHeight;
    if (distanceFromBottom < 50)
      this.logsDiv.scrollTop = this.logsDiv.scrollHeight;
  }

  detached() {
    this.subscription.dispose();
  }
}