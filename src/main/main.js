import {inject, singleton} from 'aurelia-framework';
import {withModal}         from '../shared/decorators';
import {ProjectFinder}     from '../shared/project-finder';
import {ProjectManager}    from '../shared/project-manager';
import {TaskManager}       from '../shared/task-manager';
import {ScaffoldProject}   from '../scaffolding/scaffold-project';

@inject(ProjectFinder, ProjectManager, TaskManager)
@singleton()
export class Main {
  constructor(projectFinder, projectManager, taskManager) {
    this.projectFinder = projectFinder;
    this.projectManager = projectManager;
    this.taskManager = taskManager;
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
  createProject() {}

  activateScreen(viewModelPath, model) {
    if (!model) {
      model = {
        selectedProject: this.selectedProject
      };
    }

    this._activePluginScreenModel = model;
    this._activePluginScreen = viewModelPath;
  }

  returnToPluginList() {
    this._activePluginScreen = '';
  }
}
