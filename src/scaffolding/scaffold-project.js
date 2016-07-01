import {inject}               from 'aurelia-framework';
import {DialogController}     from 'aurelia-dialog';
import {Fs}                   from '../shared/abstractions/fs';
import {ProjectManager}       from '../shared/project-manager';
import {Workflow}             from './workflow';
import activities             from './activities.json!';

@inject(DialogController, ProjectManager, Fs)
export class ScaffoldProject {
  state = {};

  constructor(dialog, projectManager, fs) {
    this.dialog = dialog;
    this.fs = fs;
    this.projectManager = projectManager;

    this.workflow = new Workflow(activities, this.state);
  }

  async next() {
    let result = await this.workflow.currentStep.execute();

    if (result.goToNextStep) {
      await this.workflow.next();
    }
  }

  close() {
    if (this.workflow.isLast) {
      let projectPath = this.fs.join(this.state.path, this.state.name);
      this.projectManager.addProjectByPath(projectPath);
      this.dialog.close(true, projectPath);
    } else {
      this.dialog.cancel();
    }
  }

  canDeactivate() {
    if (!this.workflow.isLast) {
      return confirm('Are you sure?');
    }

    return true;
  }
}
