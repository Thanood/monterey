import {Workflow}   from '../workflow';
import {FS}         from 'monterey-pal';

export class Activities {
  async activate(model) {
    this.state = model.state;
    this.step = model.step;
    this.step.execute = () => this.execute();

    let definition = JSON.parse(await FS.readFile('node_modules/aurelia-cli/lib/commands/new/new-application.json'));
    this.workflow = new Workflow(definition, model.state);
  }

  async execute() {
    if (this.activity.validation.validate().length === 0) {
      // if next() returns false then the wizard has finished
      if (await this.workflow.next() === false) {
        return {
          goToNextStep: true
        };
      }
    }

    return {
      goToNextStep: false
    };
  }
}
