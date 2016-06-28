import {inject, NewInstance}  from 'aurelia-framework';
import {ValidationRules}      from 'aurelia-validatejs';
import {ValidationController} from 'aurelia-validation';
import {Fs}                   from '../shared/abstractions/fs';

@inject(NewInstance.of(ValidationController), Fs)
export class ProjectDetail {
  constructor(validation, fs) {
    this.validation = validation;
    this.fs = fs;
  }

  activate(model) {
    this.state = model.state;
    this.step = model.step;
    this.step.next = () => this.next();
  }

  attached() {
    ValidationRules
    .ensure('path').required()
    .on(this.state);
  }

  async next() {
    if (this.validation.validate().length === 0) {
      this.step.hasFinished = true;
      return;
    }

    this.step.hasFinished = false;
  }

  async directoryBrowser() {
    let path = await this.fs.showOpenDialog({
      title: 'Select folder where the Aurelia project will be created in',
      properties: ['openDirectory']
    });

    this.state.path = path;
  }
}
