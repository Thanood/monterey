import {autoinject}       from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {FS, NPM}          from 'monterey-pal';
import {ProjectManager}   from '../shared/project-manager';
import {Workflow}         from './workflow';
import * as activities    from './activities.json!';

@autoinject()
export class ScaffoldProject {
  state: any = {};
  workflow: Workflow;

  constructor(private dialog: DialogController,
              private projectManager: ProjectManager) {
    // copy activities JSON so multiple sessions can be started
    this.workflow = new Workflow(JSON.parse(JSON.stringify(activities)), this.state);
  }

  async next() {
    await this.workflow.next();
  }

  async close() {
    if (this.workflow.isLast && this.state.successful) {
      this.state.path = FS.join(this.state.path, this.state.name);

      let proj = await this.projectManager.addProjectByWizardState(this.state);
      if (proj) {
        this.dialog.ok(proj);
        return;
      }

      this.dialog.cancel();
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
