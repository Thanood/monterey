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

  /**
  * Main entry point for adding projects to Monterey
  */
  async addProject(projectObj) {
    // have all plugins evaluate the project
    projectObj = await this.pluginManager.evaluateProject(projectObj);

    if (!projectObj.name) {
      alert('project name was not found, the project will not be added to Monterey');
      return false;
    }

    this.state.projects.push(projectObj);

    await this.state.save();

    return true;
  }


  async removeProject(project) {
    let index = this.state.projects.indexOf(project);
    this.state.projects.splice(index, 1);

    await this.state.save();
  }

  /**
  * Returns whether or not projects have been added to monterey before
  */
  hasProjects() {
    return this.state.projects.length > 0;
  }
}
