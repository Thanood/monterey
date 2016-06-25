import {inject, NewInstance}  from 'aurelia-framework';
import {DialogController}     from 'aurelia-dialog';
import {ValidationController} from 'aurelia-validation';
import {ValidationRules}      from 'aurelia-validatejs';

@inject(DialogController, NewInstance.of(ValidationController))
export class ScaffoldProject {
  constructor(dialog, validator) {
    this.dialog = dialog;
    this.validator = validator;
  }

  attached() {
    ValidationRules
    .ensure('firstName').required()
    .ensure('lastName').required()
    .ensure('email').required().email()
    .on(this);
  }

  submit() {
    let errors = this.validator.validate();
    console.log(errors);
  }
}
