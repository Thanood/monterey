import {bindable} from    'aurelia-framework';
import {Project}  from    '../../shared/project';
import {CommandTree} from '../workflow/command-tree';

export class WorkflowTab {
  @bindable state: { project: Project };
  trees: Array<CommandTree> = [];

  stateChanged() {
    if (!this.state) return;

    let project = this.state.project;
    this.trees = project.workflowTrees;
    console.log(this.trees);
  }
}