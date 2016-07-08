import {inject, observable, BindingEngine,  NewInstance, Disposable} from 'aurelia-framework';
import {ValidationRules}      from 'aurelia-validatejs';
import {ValidationController} from 'aurelia-validation';
import {MontereyRegistries}   from '../shared/monterey-registries';
import {FS}                   from 'monterey-pal';
import {IStep}                from './istep';

@inject(NewInstance.of(ValidationController), BindingEngine, MontereyRegistries)
export class ProjectDetail {
  step: IStep;
  state;
  subscription: Disposable;
  templates = [];

  constructor(private validation: ValidationController,
              private bindingEngine: BindingEngine,
              private registries: MontereyRegistries) {
  }

  async activate(model) {
    this.state = model.state;
    this.step = model.step;
    this.step.execute = () => this.execute();
    this.step.previous = () => this.previous();

    let observer = this.bindingEngine.propertyObserver(this.state, 'source');
    this.subscription = observer.subscribe(() => this.sourceChanged());

    this.templates = await this.registries.getTemplates();
    this.templates.push({
      name: 'a',
      repo: 'monterey-framework/registries',
    });
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
