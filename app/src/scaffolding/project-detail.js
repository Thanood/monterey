import {inject, observable, BindingEngine,  NewInstance} from 'aurelia-framework';
import {ValidationRules}      from 'aurelia-validatejs';
import {ValidationController} from 'aurelia-validation';
import {FS}                   from 'monterey-pal';

@inject(NewInstance.of(ValidationController), BindingEngine)
export class ProjectDetail {
  skeletons = [
    'skeleton-esnext-aspnetcore',
    'skeleton-esnext-webpack',
    'skeleton-esnext',
    'skeleton-typescript-aspnetcore',
    'skeleton-typescript-webpack',
    'skeleton-typescript'
  ];

  constructor(validation, bindingEngine) {
    this.validation = validation;
    this.bindingEngine = bindingEngine;
  }

  activate(model) {
    this.state = model.state;
    this.step = model.step;
    this.step.execute = () => this.execute();
    this.step.previous = () => this.previous();

    let observer = this.bindingEngine.propertyObserver(this.state, 'source');
    this.subscription = observer.subscribe(() => this.sourceChanged());
  }

  sourceChanged() {
    this.updateValidationRules();
    this.validation.validate();
  }

  attached() {
    this.updateValidationRules();
  }

  async previous() {
    return {
      goToPreviousStep: false
    };
  }

  updateValidationRules() {
    let r = ValidationRules
    .ensure('path').required();

    if (this.state.source === 'zip') {
      r = r.ensure('zipUrl').required();
    }

    r.on(this.state);
  }

  async execute() {
    let canContinue = false;

    if (this.validation.validate().length === 0) {
      this.subscription.dispose();
      canContinue = true;
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
