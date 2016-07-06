import {autoinject}    from 'aurelia-framework';
import {UpdateChecker} from './shared/update-checker';

@autoinject()
export class App {

  constructor(private updateChecker: UpdateChecker) {
  }

  attached() {
    this.updateChecker.checkUpdates();
  }

  configureRouter(config, router) {
    config.title = 'Monterey';
  }
}
