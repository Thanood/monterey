import {autoinject}         from 'aurelia-framework';
import {PluginManager}      from './plugin-manager';
import {ApplicationState}   from './application-state';
import {FS}                 from 'monterey-pal';
import {Project}            from './project';
import {Notification}       from './notification';

@autoinject()
export class ProjectManager {

  constructor(private pluginManager: PluginManager,
              public state: ApplicationState,
              private notification: Notification) {
  }

  /**
   * Add a project to monterey with the root path of the project
   * This is a folder path
   */
  async addProjectByPath(path: string) {
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
  async addProject(projectObj: Project): Promise<Project|boolean> {
    // have all plugins evaluate the project
    projectObj = await this.pluginManager.evaluateProject(projectObj);

    if (!projectObj.packageJSONPath) {
      this.notification.error('location of package.json was not found, the project will not be added to Monterey');
      return false;
    }

    if (!projectObj.name) {
      this.notification.error('project name was not found, the project will not be added to Monterey');
      return false;
    }

    this.state.projects.push(projectObj);

    await this.pluginManager.notifyOfAddedProject(projectObj);

    await this.state._save();

    return projectObj;
  }

  /**
   * Remove a project from the applicationstate and persist changes
   */
  async removeProject(project) {
    let index = this.state.projects.indexOf(project);
    this.state.projects.splice(index, 1);

    await this.state._save();
  }

  /**
   * Confirm that the package.json of every project still exists
   * if not, then it has been moved/removed and we should remove it
   * from monterey
   */
  async verifyProjectsExistence() {
    let promises = [];

    this.state.projects.forEach(project => {
      promises.push(FS.fileExists(project.packageJSONPath)
        .then(exists => {
          return {
            project: project,
            exists: exists
          };
        }));
    });

    let result = await Promise.all(promises);
    let removeProjects = result.filter(i => !i.exists);

    if (removeProjects.length > 0) {
      let projectNames = removeProjects.map(i => i.project.name).join(', ');
      // do we need an alert here?
      this.notification.warning(`The following projects were removed/relocated and will be removed from Monterey:\r\n ${projectNames}`);

      removeProjects.forEach(r => {
        let index = this.state.projects.indexOf(r);
        this.state.projects.splice(index, 1);
      });

      await this.state._save();
    }
  }

  /**
  * Returns whether or not projects have been added to monterey before
  */
  hasProjects() {
    return this.state.projects.length > 0;
  }
}
