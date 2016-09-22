import {inject, NewInstance}  from 'aurelia-framework';
import {ValidationRules}      from 'aurelia-validatejs';
import {ValidationController} from 'aurelia-validation';
import {DialogController}     from 'aurelia-dialog';
import {FS}                   from 'monterey-pal';
import {Notification}         from './notification';

/**
 * `FileSelectorModal` is a modal that asks the user to select a file and returns the file path to the caller
 */
@inject(DialogController, NewInstance.of(ValidationController), Notification)
export class FileSelectorModal {
  model;
  description: string;
  defaultPath: string;
  expectedFileName: string;
  filters: Array<any>;
  selectedFilePath: string;

  constructor(private dialogController: DialogController,
              private validation: ValidationController,
              private notification: Notification) {
  }

  activate(model) {
    Object.assign(this, model);

    if (!this.description) {
      this.description = `Please locate ${this.expectedFileName}`;
    }

    new ValidationRules()
      .ensure('selectedFilePath').presence()
      .on(this);
  }

  async browser() {
    let paths = await FS.showOpenDialog({
      title: `Select ${this.expectedFileName}`,
      properties: ['openFile'],
      defaultPath: this.defaultPath,
      filters: this.filters
    });

    if (paths) {
      if (paths.length === 1) {
        this.selectedFilePath = paths[0];
      } else if (paths.length > 1) {
        this.notification.warning('Please select one webpack.config.js file');
      };
    }
  }

  ok() {
    if (this.validation.validate().length > 0) {
      this.notification.warning('There are validation errors');
      return;
    }

    this.dialogController.ok(this.selectedFilePath);
  }
}
