import {autoinject, LogManager} from 'aurelia-framework';
import {Logger}                 from 'aurelia-logging';
import {PluginManager}          from './plugin-manager';
import {ApplicationState}       from './application-state';
import {FS}                     from 'monterey-pal';
import {Project}                from './project';
import {Notification}           from './notification';
import {EventAggregator}        from 'aurelia-event-aggregator';

const logger = <Logger>LogManager.getLogger('project-manager');

/**
 * The ProjectManager is responsible for adding and removing projects from the ApplicationState.
 */
@autoinject()
export class ProjectManager {

  constructor(private pluginManager: PluginManager,
              public state: ApplicationState,
              private notification: Notification,
              private ea: EventAggregator) {
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
        name: state.name,
        __meta__: state.__meta__
    });
  }

  /**
  * Main entry point for adding projects to Monterey
  */
  async addProject(projectObj): Promise<Project> {
    let project = new Project(projectObj);

    // have all plugins evaluate the project
    await this.pluginManager.evaluateProject(project);


    // use the directory name as project name as fallback
    if (!project.name) {
      project.name = FS.getDirName(project.path);
    }

    this.state.projects.push(project);

    await this.pluginManager.notifyOfAddedProject(project);

    await this.state._save();

    this.ea.publish('ProjectAdded', project);
    logger.info('Project added');

    return project;
  }

  /**
   * Remove a project from the applicationstate and persist changes
   */
  async removeProject(project) {
    let index = this.state.projects.indexOf(project);
    this.state.projects.splice(index, 1);

    await this.state._save();

    this.ea.publish('ProjectRemoved', project);
    logger.info('Project removed');
  }

  /**
   * Confirm that the package.json of every project still exists
   * if not, then it has been moved/removed and we should remove it
   * from monterey
   */
  async verifyProjectsExistence() {
    let promises = [];

    this.state.projects.forEach(project => {
      promises.push(FS.folderExists(project.path)
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
      this.notification.warning(`The following projects were removed/relocated and will be removed from Monterey:\r\n ${projectNames}`);
      logger.warn(`The following projects were removed/relocated and will be removed from Monterey:\r\n ${projectNames}`);

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
