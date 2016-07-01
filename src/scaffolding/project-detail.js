import {inject, observable,
  NewInstance}                from 'aurelia-framework';
import {ValidationRules}      from 'aurelia-validatejs';
import {ValidationController} from 'aurelia-validation';
import {Fs}                   from '../shared/abstractions/fs';

@inject(NewInstance.of(ValidationController), Fs)
export class ProjectDetail {
  @observable source = 'cli';

  skeletons = [
    'skeleton-esnext-aspnetcore',
    'skeleton-esnext-webpack',
    'skeleton-esnext',
    'skeleton-typescript-aspnetcore',
    'skeleton-typescript-webpack',
    'skeleton-typescript'
  ];

  constructor(validation, fs) {
    this.validation = validation;
    this.fs = fs;
  }

  activate(model) {
    this.state = model.state;
    this.step = model.step;
    this.step.execute = () => this.execute();
  }

  sourceChanged() {
    this.updateValidationRules();
    this.validation.validate();
  }

  attached() {
    this.updateValidationRules();
  }

  updateValidationRules() {
    let r = ValidationRules
    .ensure('path').required();

    if (this.source === 'zip') {
      r = r.ensure('zipUrl').required();
    }

    r.on(this.state);
  }

  async execute() {
    let canContinue = false;

    if (this.validation.validate().length === 0) {
      canContinue = true;

      this.state.source = this.source;
    }

    return {
      goToNextStep: canContinue
    };
  }

  async directoryBrowser() {
    let path = await this.fs.showOpenDialog({
      title: 'Select folder where the Aurelia project will be created in',
      properties: ['openDirectory']
    });

    this.state.path = path;
  }
}
