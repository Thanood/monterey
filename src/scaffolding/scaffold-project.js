import {inject}               from 'aurelia-framework';
import {DialogController}     from 'aurelia-dialog';
import {WorkflowHelper}       from './workflow-helper';
import {Fs}                   from '../shared/abstractions/fs';

@inject(DialogController, Fs)
export class ScaffoldProject {
  finished = false;

  constructor(dialog, fs) {
    this.dialog = dialog;
    this.fs = fs;
  }

  async activate() {
    let definition = JSON.parse(await this.fs.readFile('node_modules/aurelia-cli/lib/commands/new/new-application.json'));
    this.workflow = new WorkflowHelper(definition);
  }

  async attached() {
  }

  next() {
    if (this.activity.validation.validate().length > 0) {
      return;
    }

    // if next() returns false then the process has finished
    if (this.workflow.next() === false) {
      this.finished = true;
    }
  }

  canDeactivate() {
    if (this.workflow.currentStep.id > 2) {
      return confirm('Are you sure?');
    }

    return true;
  }
}
