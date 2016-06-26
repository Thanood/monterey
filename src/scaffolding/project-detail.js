import {inject, NewInstance, bindable}  from 'aurelia-framework';
import {ValidationRules}                from 'aurelia-validatejs';
import {ValidationController}           from 'aurelia-validation';
import {Fs}                             from '../shared/abstractions/fs';

@inject(NewInstance.of(ValidationController), Fs)
export class ProjectDetail {

  @bindable state = {};

  constructor(validation, fs) {
    this.validation = validation;
    this.fs = fs;
  }

  attached() {
    ValidationRules
    .ensure('path').required()
    .on(this.state);
  }

  async directoryBrowser() {
    let path = await this.fs.showOpenDialog({
      title: 'Select folder where the Aurelia project will be created in',
      properties: ['openDirectory']
    });

    this.state.path = path;
  }
}
