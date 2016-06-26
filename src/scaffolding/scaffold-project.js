import {inject}               from 'aurelia-framework';
import {DialogController}     from 'aurelia-dialog';
import {WorkflowHelper}       from './workflow-helper';
import {Fs}                   from '../shared/abstractions/fs';
import {AureliaCLI}           from '../shared/abstractions/aurelia-cli';

@inject(DialogController, Fs, AureliaCLI)
export class ScaffoldProject {
  finished = false;
  firstStep = true;

  constructor(dialog, fs, aureliaCLI) {
    this.dialog = dialog;
    this.fs = fs;
    this.aureliaCLI = aureliaCLI;
  }

  async activate() {
    let definition = JSON.parse(await this.fs.readFile('node_modules/aurelia-cli/lib/commands/new/new-application.json'));
    this.workflow = new WorkflowHelper(definition, this.aureliaCLI);
  }

  async next() {
    if (this.firstStep) {
      if (this.projectDetail.validation.validate().length > 0) {
        return;
      }

      this.firstStep = false;
      return;
    }

    // don't go to the next step if there is a validation error
    if (this.activity.validation.validate().length > 0) {
      return;
    }

    // if next() returns false then the wizard has finished
    if (await this.workflow.next() === false) {
      this.finished = true;
    }
  }

  canDeactivate() {
    if (!this.finished) {
      return confirm('Are you sure?');
    }

    return true;
  }
}
