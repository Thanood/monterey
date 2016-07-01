import {inject}     from 'aurelia-framework';
import {AureliaCLI} from '../../shared/abstractions/aurelia-cli';

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
    this.step.execute = () => this.execute();
  }

  async attached() {
    this.promise = new Promise(async (resolve, reject) => {
      this.finished = false;
      try {
        debugger;
        await this.aureliaCLI.create(this.state);
        this.finished = true;
        resolve();
      } catch (e) {
        alert('Error while scaffolding the application: ' + e.message);
        console.log(e);
        this.failed = true;
        reject();
      }
    });
  }

  async execute() {
    return {
      goToNextStep: this.finished
    };
  }
}
