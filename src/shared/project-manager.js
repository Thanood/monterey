import {inject}        from 'aurelia-framework';
import {PluginManager} from './plugin-manager';
import {Session}       from './abstractions/session';
import {Fs}            from './abstractions/fs';

@inject(Session, Fs, PluginManager)
export class ProjectManager {
  constructor(session, fs, pluginManager) {
    this.session = session;
    this.fs = fs;
    this.pluginManager = pluginManager;
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

    await this.save();

    return true;
  }


  async removeProject(project) {
    let index = this.state.projects.indexOf(project);
    this.state.projects.splice(index, 1);

    await this.save();
  }

  /**
  * Returns whether or not projects have been added to monterey before
  */
  hasProjects() {
    return this.state.projects.length > 0;
  }

  /**
  * Persists the state to session
  */
  async save() {
    let str = JSON.stringify(this.normalize(this.state));
    this.session.set('state', str);
  }

  // JSON.stringify does not take getter properties into account
  // which sometimes lead to properties not being persisted into the session
  normalize(state) {
    let normalized = { projects: [] };
    state.projects.forEach(proj => {
      normalized.projects.push({
        name: proj.name,
        path: proj.path
      });
    });
    return normalized;
  }


  /**
  * restores the application state from session
  */
  async _loadStateFromSession() {
    let state = await this.session.get('state');
    if (state) {
      this.state = JSON.parse(state);
    } else {
      this.state = {
        projects: []
      };
    }

    console.log('Loaded state: ', this.state);
  }
}
