import {inject, NewInstance} from 'aurelia-framework';
import {ValidationRules}      from 'aurelia-validatejs';
import {ValidationController} from 'aurelia-validation';
import {IStep}                from '../istep';

@inject(NewInstance.of(ValidationController))
export class UrlInput {
  step: IStep;
  state;
  templates = [];

  constructor(private validation: ValidationController) {
  }

  async activate(model) {
    this.state = model.state;
    this.step = model.step;
    this.step.execute = () => this.execute();
    this.step.previous = () => this.previous();
  }

  attached() {
    ValidationRules
      .ensure('zipUrl').required()
      .on(this.state);
  }

  async previous() {
    return {
      goToPreviousStep: true
    };
  }

  async execute() {
    return {
      goToNextStep: this.validation.validate().length === 0
    };
  }
}
