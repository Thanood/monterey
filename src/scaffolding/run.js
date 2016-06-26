import {inject} from 'aurelia-framework';
import {AureliaCLI} from '../shared/abstractions/aurelia-cli';

@inject(AureliaCLI)
export class Run {
  constructor(aureliaCLI) {
    this.aureliaCLI = aureliaCLI;
  }

  async activate(model) {
    this.state = model.state;
    this.step = model.step;
    this.step.next = () => this.next();
  }

  async attached() {
    this.finished = false;
    await this.aureliaCLI.create(this.state);
    await this.delay();
    await this.aureliaCLI.install(this.state);
    this.finished = true;
  }

  async next() {
    return this.finished;
  }

  delay(timeout = 1000) {
    return new Promise(resolve => {
      setTimeout(() => resolve(), timeout);
    });
  }
}
