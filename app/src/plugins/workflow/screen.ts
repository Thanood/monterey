import {Main}            from '../../main/main';
import {CommandTree}     from '../task-manager/index';
import {WorkflowCreator} from './workflow-creator';
import {ApplicationState, Notification, SelectedProject, bindable, autoinject} from '../../shared/index';

@autoinject()
export class Screen {
  trees: Array<CommandTree> = [];
  selectedTree: CommandTree;
  creator: WorkflowCreator;

  constructor(private appState: ApplicationState,
              private main: Main,
              private notification: Notification,
              private selectedProject: SelectedProject) {}

  attached() {
    let project = this.selectedProject.current;
    this.trees = JSON.parse(JSON.stringify(project.workflowTrees));

    if (this.trees.length > 0) {
      this.selectedTree = this.trees[0];
    } else {
      this.selectedTree = null;
    }
  }

  createNew() {
    this.trees.push(new CommandTree({}));

    this.selectedTree = this.trees[this.trees.length - 1];
  }

  remove() {
    if (!this.selectedTree) {
      alert('Please select a workflow');
      return;
    }

    if (!confirm(`Are you sure that you want to remove the "${this.selectedTree.name}"?`)) {
      return;
    }


    this.trees.splice(this.trees.indexOf(this.selectedTree), 1);

    if (this.trees.length > 0) {
      this.selectedTree = this.trees[0];
    } else {
      this.selectedTree = null;
    }
  }

  async save() {
    this.creator.refreshTree();

    this.selectedProject.current.workflowTrees = JSON.parse(JSON.stringify(this.trees));

    await this.appState._save();
    this.notification.success('Saved');
  }

  async addAsTile() {
    if (!this.selectedTree) {
      alert('Please select a workflow');
      return;
    }

    if (!this.selectedTree.tile) {
      this.selectedTree.tile = true;
    } else {
      this.selectedTree.tile = false;
    }

    await this.appState._save();

    this.notification.success(`Tile ${this.selectedTree.tile ? 'enabled'  : 'disabled'} for ${this.selectedTree.name}`);
  }

  goBack() {
    this.main.returnToPluginList();
  }
}