import {IStep}                from './istep';
import {inject, NewInstance,
  BindingEngine, Disposable}  from 'aurelia-framework';
import {ValidationRules}      from 'aurelia-validatejs';
import {ValidationController} from 'aurelia-validation';
import {Notification}         from '../shared/index';
import {FS}                   from 'monterey-pal';

/**
 * The ProjectName screen asks the user how the project should be named.
 * It also checks whether or not the target folder already exists.
 */
@inject(NewInstance.of(ValidationController), BindingEngine, Notification)
export class ProjectName {
  state;
  step: IStep;
  available: boolean;
  textfield: Element;
  observer: Disposable;

  constructor(private validation: ValidationController,
              private bindingEngine: BindingEngine,
              private notification: Notification) {
  }

  async activate(model) {
    this.state = model.state;
    this.step = model.step;
    this.step.execute = () => this.execute();
    this.step.previous = () => this.previous();

    // observe the name property, so we can check for project folder existence
    this.observer = this.bindingEngine.propertyObserver(this.state, 'name').subscribe(() => this.nameChanged());
  }

  attached() {
    ValidationRules
    .ensure('name').required()
    .on(this.state);

    this.checkFolderExistence();

    // focus the textfield, so users can start typing immediately
    (<any>this.textfield).focus();
  }

  nameChanged() {
    this.checkFolderExistence();
  }

  async checkFolderExistence() {
    if (!this.state.name) return;

    let path = FS.join(this.state.path, this.state.name);
    let folderExists = await FS.folderExists(path);
    this.available = !folderExists;
  }

  async execute() {
    let canContinue = false;

    // wait for debounce to finish, gives a better user experience
    await new Promise(resolve => setTimeout(resolve, 500));

    if (this.validation.validate().length === 0) {
      if (this.available) {
        canContinue = true;
        this.observer.dispose();
      } else {
        this.notification.warning('Please select a project folder that does not exist yet');
      }
    }

    return {
      goToNextStep: canContinue
    };
  }

  detached() {
    this.observer.dispose();
  }

  async previous() {
    return {
      goToPreviousStep: true
    };
  }
}
