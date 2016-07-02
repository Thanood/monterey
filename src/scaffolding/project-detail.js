import {inject, observable,
  NewInstance}                from 'aurelia-framework';
import {ValidationRules}      from 'aurelia-validatejs';
import {ValidationController} from 'aurelia-validation';
import {FS}                   from 'monterey-pal';

@inject(NewInstance.of(ValidationController))
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

  constructor(validation) {
    this.validation = validation;
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
    let path = await FS.showOpenDialog({
      title: 'Select folder where the Aurelia project will be created in',
      properties: ['openDirectory']
    });

    this.state.path = path;
  }
}
