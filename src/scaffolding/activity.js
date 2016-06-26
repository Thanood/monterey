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

  stepChanged() {
    $('.form-control', this.element).focus();
  }

  attached() {
    ValidationRules
    .ensure('answer').required()
    .on(this.step);

    $('.form-control', this.element).focus();
  }

  emitSubmit() {
    let event = new CustomEvent('submit', {
      bubbles: true
    });
    this.element.dispatchEvent(event);
  }
}
