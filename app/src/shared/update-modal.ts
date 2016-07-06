import {autoinject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@autoinject()
export class UpdateModal {
  release;
  currentVersion: string;

  constructor(private dialog: DialogController) {}

  activate(model) {
    this.release = model.release;
    this.currentVersion = model.currentVersion;
  }
}

