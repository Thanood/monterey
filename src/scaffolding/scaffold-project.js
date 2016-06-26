import {inject}               from 'aurelia-framework';
import {DialogController}     from 'aurelia-dialog';
import {WorkflowHelper}       from './workflow-helper';
import {Fs}                   from '../shared/abstractions/fs';

@inject(DialogController, Fs)
export class ScaffoldProject {
  constructor(dialog, fs) {
    this.dialog = dialog;
    this.fs = fs;
  }

  async activate() {
    let definition = JSON.parse(await this.fs.readFile('node_modules/aurelia-cli/lib/commands/new/new-application.json'));
    console.log(definition);
    this.workflow = new WorkflowHelper(definition);
  }

  async attached() {
  }

  submit() {}

  next() {
    if (this.activity.validation.validate().length > 0) {
      return;
    }

    this.workflow.next();
  }

  canDeactivate() {
    if (this.workflow.currentStep.id > 2) {
      return confirm('Are you sure?');
    }

    return true;
  }
}
