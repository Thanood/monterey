import {inject}     from 'aurelia-framework';
import {AureliaCLI} from '../shared/abstractions/aurelia-cli';

@inject(AureliaCLI)
export class Run {
  failed = false;
  finished = false;

  constructor(aureliaCLI) {
    this.aureliaCLI = aureliaCLI;
  }

  async activate(model) {
    this.model = model;
    this.state = model.state;
    this.step = model.step;
    this.step.next = () => this.next();
  }

  async attached() {
    this.finished = false;
    try {
      await this.aureliaCLI.create(this.state);
      this.finished = true;
    } catch (e) {
      alert('Error while scaffolding the application: ' + e.message);
      console.log(e);
      this.failed = true;
    }
  }

  async next() {
    this.step.hasFinished = this.finished || this.failed;
  }
}
