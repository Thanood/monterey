import {inject}               from 'aurelia-framework';
import {DialogController}     from 'aurelia-dialog';
import {FS}                   from 'monterey-pal';
import {ProjectManager}       from '../shared/project-manager';
import {Workflow}             from './workflow';
import activities             from './activities.json!';

@inject(DialogController, ProjectManager)
export class ScaffoldProject {
  state = {};

  constructor(dialog, projectManager) {
    this.dialog = dialog;
    this.projectManager = projectManager;

    // copy activities JSON so multiple sessions can be started
    let dupl = JSON.parse(JSON.stringify(activities));
    this.workflow = new Workflow(dupl, this.state);
  }

  async next() {
    await this.workflow.next();
  }

  close() {
    if (this.workflow.isLast) {
      let projectPath = FS.join(this.state.path, this.state.name);
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
