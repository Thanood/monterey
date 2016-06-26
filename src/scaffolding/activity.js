import {inject, bindable, NewInstance} from 'aurelia-framework';
import {ValidationRules}               from 'aurelia-validatejs';
import {ValidationController}          from 'aurelia-validation';

@inject(NewInstance.of(ValidationController), Element)
export class Activity {
  @bindable step;

  constructor(validation, element) {
    this.validation = validation;
    this.element = element;
  }

  // whenever a step changes, reapply the validation rules
  // necessary because the entire step instance changes, not just values of the step
  stepChanged() {
    ValidationRules
    .ensure('answer').required()
    .on(this.step);
  }

  attached() {
    this.focusInput();
  }

  // get the first form-control and focus that element
  focusInput() {
    let input = this.element.querySelectorAll('.form-control')[0];
    if (input) {
      input.focus();
    }
  }
}
