import {inject, computedFrom} from 'aurelia-framework';
import {DialogController}     from 'aurelia-dialog';

@inject(DialogController)
export class ScaffoldProject {
  state = {};
  steps = [{
    viewModel: './project-detail'
  }, {
    viewModel: './activities'
  }, {
    viewModel: './project-description'
  }, {
    viewModel: './run'
  }, {
    viewModel: './finished'
  }];
  currentStepIndex = 0;

  constructor(dialog) {
    this.dialog = dialog;
  }

  @computedFrom('currentStepIndex')
  get currentStep() {
    return this.steps[this.currentStepIndex];
  }

  get isLast() {
    return this.currentStepIndex === this.steps.length - 1;
  }

  async next() {
    // the step knows whether or not to go to the next step
    // if next() returns true, then go to the next step
    if (await this.currentStep.next()) {
      this.currentStepIndex ++;
    }
  }

  canDeactivate() {
    if (!this.isLast) {
      return confirm('Are you sure?');
    }

    return true;
  }
}
