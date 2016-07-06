import {autoinject}       from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {FS}               from 'monterey-pal';
import {ProjectManager}   from '../shared/project-manager';
import {Workflow}         from './workflow';
// https://github.com/systemjs/plugin-json/issues/9#issuecomment-222405001 :(
import * as activities         from './activities.json!';

@autoinject()
export class ScaffoldProject {
  state: any = {};
  workflow: Workflow;

  constructor(private dialog: DialogController,
              private projectManager: ProjectManager) {
    // copy activities JSON so multiple sessions can be started
    this.workflow = new Workflow(activities, this.state);
  }

  async next() {
    await this.workflow.next();
  }

  close() {
    if (this.workflow.isLast && this.state.successful) {
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
