import {autoinject, singleton} from 'aurelia-framework';
import {withModal}         from '../shared/decorators';
import {ProjectFinder}     from '../shared/project-finder';
import {SelectedProject}   from '../shared/selected-project';
import {Project}           from '../shared/project';
import {TaskManager}       from '../plugins/task-manager/task-manager';
import {ScaffoldProject}   from '../scaffolding/scaffold-project';
import {Tiles}             from './components/tiles';
import {ProjectList}       from './components/project-list';

@autoinject()
@singleton()
export class Main {

  _activePluginScreenModel;
  _activePluginScreen: string;
  tilesVM: Tiles;
  projectList: ProjectList;
  pluginViewActivated: boolean;
  startTour: boolean;

  constructor(private projectFinder: ProjectFinder,
              private selectedProject: SelectedProject,
              private taskManager: TaskManager) {
  }

  async addProject() {
    await this.projectFinder.openDialog();
  }

  async removeProject() {
    await this.projectList.removeProject();
  }

  @withModal(ScaffoldProject)
  createProject(proj: Project) {
    this.selectedProject.set(proj);
  }

  activateScreen(viewModelPath: string, model = null) {
    if (!model) {
      model = {
        selectedProject: this.selectedProject.current
      };
    }

    this._activePluginScreenModel = model;
    this._activePluginScreen = viewModelPath;
    this.pluginViewActivated = true;
  }

  returnToPluginList() {
    this.refreshTiles();
    this._activePluginScreen = '';
    this.pluginViewActivated = false;
  }

  refreshTiles() {
    this.tilesVM.refreshTiles();
  }
}
