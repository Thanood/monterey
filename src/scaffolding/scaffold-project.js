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
    viewModel: './run',
    autoRun: true
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

  get isLast() {
    return this.currentStepIndex === this.steps.length - 1;
  }

  async next() {
    let result = await this.currentStep.execute();

    if (result.goToNextStep && !this.isLast) {
      this.currentStepIndex ++;

      if (this.currentStep.autoRun) {
        // wait for <compose> to finish so we can execute the next step automatically
        await new Promise(resolve => setTimeout(() => resolve(), 500));

        await this.next();
      }
    }
  }

  close() {
    if (this.isLast) {
      let projectPath = this.fs.join(this.state.path, this.state.name);
      this.projectManager.addProjectByPath(projectPath);
      this.dialog.close(true, projectPath);
    } else {
      this.dialog.cancel();
    }
  }

  canDeactivate() {
    if (!this.isLast) {
      return confirm('Are you sure?');
    }

    return true;
  }
}
