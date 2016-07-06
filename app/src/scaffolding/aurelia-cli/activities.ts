import {Workflow}   from '../workflow';
import {FS}         from 'monterey-pal';

export class Activities {

  state;
  step;
  workflow: Workflow;

  async activate(model) {
    this.state = model.state;
    this.step = model.step;
    this.step.execute = () => this.execute();
    this.step.previous = () => this.previous();

    if (!this.state.workflow) {
      let definition = JSON.parse(await FS.readFile(FS.join(FS.getRootDir(), 'node_modules/aurelia-cli/lib/commands/new/new-application.json')));
      this.state.workflow = new Workflow(definition, this.state);
    }

    this.workflow = this.state.workflow;

    if (this.workflow.isLast) {
      this.workflow.previous();
    }
  }

  async execute() {
    if (await this.workflow.next() === false) {
      return {
        goToNextStep: true
      };
    }

    return {
      goToNextStep: false
    };
  }

  async previous() {
    let firstStep = this.workflow.currentStep.id === this.workflow.firstStep.id;

    if (firstStep) {
      return {
        goToPreviousStep: true
      };
    }

    await this.workflow.previous();

    return {
      goToPreviousStep: false
    };
  }
}
