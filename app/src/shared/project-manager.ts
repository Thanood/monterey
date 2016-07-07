import {autoinject}         from 'aurelia-framework';
import {PluginManager}      from './plugin-manager';
import {ApplicationState}   from './application-state';

@autoinject()
export class ProjectManager {

  constructor(private pluginManager: PluginManager,
              public state: ApplicationState) {
  }

  async addProjectByPath(path) {
    return await this.addProject({
      path: path
    });
  }

  async addProjectByWizardState(state) {
    return await this.addProject({
        installNPM: state.installNPM,
        path: state.path,
        name: state.name
    });
  }

  /**
  * Main entry point for adding projects to Monterey
  */
  async addProject(projectObj) {
    // have all plugins evaluate the project
    projectObj = await this.pluginManager.evaluateProject(projectObj);

    if (!projectObj.packageJSONPath) {
      alert('location of package.json was not found, the project will not be added to Monterey');
      return false;
    }

    if (!projectObj.name) {
      alert('project name was not found, the project will not be added to Monterey');
      return false;
    }

    this.state.projects.push(projectObj);

    await this.pluginManager.notifyOfAddedProject(projectObj);

    await this.state._save();

    return projectObj;
  }


  async removeProject(project) {
    let index = this.state.projects.indexOf(project);
    this.state.projects.splice(index, 1);

    await this.state._save();
  }

  /**
  * Returns whether or not projects have been added to monterey before
  */
  hasProjects() {
    return this.state.projects.length > 0;
  }
}
