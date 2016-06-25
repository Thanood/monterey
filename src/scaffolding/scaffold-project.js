import {inject, NewInstance}  from 'aurelia-framework';
import {DialogController}     from 'aurelia-dialog';
import {ValidationController} from 'aurelia-validation';
import {ValidationRules}      from 'aurelia-validatejs';
import {Fs}                   from '../shared/abstractions/fs';

@inject(DialogController, NewInstance.of(ValidationController), Fs)
export class ScaffoldProject {
  constructor(dialog, validator, fs) {
    this.dialog = dialog;
    this.validator = validator;
    this.fs = fs;
  }

  async activate() {
    this.questions = JSON.parse(await this.fs.readFile('node_modules/aurelia-cli/lib/commands/new/new-application.json'));

    console.log(this.questions);
    alert(`Loaded ${this.questions.activities.length} questions from aurelia-cli`);
  }

  async attached() {
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
