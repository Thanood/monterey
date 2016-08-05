import {autoinject, singleton} from 'aurelia-framework';
import {withModal}         from '../shared/decorators';
import {ProjectFinder}     from '../shared/project-finder';
import {ProjectManager}    from '../shared/project-manager';
import {TaskManager}       from '../plugins/task-manager/task-manager';
import {ScaffoldProject}   from '../scaffolding/scaffold-project';
import {Tiles}             from './components/tiles';
import {Project}           from '../shared/project';

@autoinject()
@singleton()
export class Main {

  selectedProject: Project;
  _activePluginScreenModel;
  _activePluginScreen: string;
  tilesVM: Tiles;
  pluginViewActivated : boolean;

  constructor(private projectFinder: ProjectFinder,
              private projectManager: ProjectManager,
              private taskManager: TaskManager) {
  }

  async addProject() {
    await this.projectFinder.openDialog();
  }

  async removeProject() {
    if (!this.selectedProject) {
      return;
    }

    if (!confirm('Are you sure? We will not remove the actual project')) {
      return;
    }

    await this.projectManager.removeProject(this.selectedProject);

    if (this.projectManager.state.projects.length > 0) {
      this.selectedProject = this.projectManager.state.projects[0];
    } else {
      this.selectedProject = null;
    }
  }

  @withModal(ScaffoldProject)
  createProject(proj) {
    this.selectedProject = proj;
  }

  activateScreen(viewModelPath, model = null) {
    if (!model) {
      model = {
        selectedProject: this.selectedProject
      };
    }

    this._activePluginScreenModel = model;
    this._activePluginScreen = viewModelPath;
    this.pluginViewActivated = true;

  }

  returnToPluginList() {
    if (this._activePluginScreenModel.beforeReturn) {
      if (this._activePluginScreenModel.beforeReturn() === false) {
        return;
      }
    }
    this._activePluginScreen = '';
    this.pluginViewActivated = false;
  }

  refreshTiles() {
    this.tilesVM.refreshTiles();
  }
}
