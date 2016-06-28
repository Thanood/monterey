import {inject, computedFrom} from 'aurelia-framework';
import {DialogController}     from 'aurelia-dialog';
import {Fs}                   from '../shared/abstractions/fs';
import {ProjectManager}       from '../shared/project-manager';

@inject(DialogController, ProjectManager, Fs)
export class ScaffoldProject {
  state = {};
  steps = [{
    viewModel: './project-detail'
  }, {
    viewModel: './activities'
  }, {
    viewModel: './project-description'
  }, {
    viewModel: './run'
  }];
  currentStepIndex = 0;

  constructor(dialog, projectManager, fs) {
    this.dialog = dialog;
    this.fs = fs;
    this.projectManager = projectManager;
  }

  @computedFrom('currentStepIndex')
  get currentStep() {
    return this.steps[this.currentStepIndex];
  }

  get hasFinished() {
    return this.currentStepIndex === this.steps.length - 1;
  }

  async next() {
    await this.currentStep.next();

    if (this.currentStep.hasFinished) {
      this.currentStepIndex ++;
    }
  }

  close() {
    if (this.hasFinished) {
      let projectPath = this.fs.join(this.state.path, this.state.name);
      this.projectManager.addProjectByPath(projectPath);
      this.dialog.close(true, projectPath);
    } else {
      this.dialog.cancel();
    }
  }

  canDeactivate() {
    if (!this.hasFinished) {
      return confirm('Are you sure?');
    }

    return true;
  }
}
