import {TaskManager}           from '../plugins/task-manager/index';
import {Updater}               from '../updater/updater';
import {ScaffoldProject}       from '../scaffolding/scaffold-project';
import {Tiles}                 from './components/tiles';
import {ProjectList}           from './components/project-list';
import {SelectedProject, Project, Settings, ProjectFinder, withModal, autoinject, singleton} from '../shared/index';

/**
 * Almost everything in Monterey is inside the Main screen.
 * Plugins can tell the Main screen to show a particular screen (also called "plugin view")
 * or they can tell the Main screen to return to the Tiles view
 */
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
              private taskManager: TaskManager,
              private updater: Updater,
              private settings: Settings) {

    this.settings.addSetting({
      identifier: 'check-for-updates',
      title: 'Check for updates?',
      type: 'boolean',
      value: true
    });
  }

  async attached() {
    if (this.settings.getValue('check-for-updates')) {
      await this.updater.checkForUpdate();
    }
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

    this.tilesVM.clear();
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
