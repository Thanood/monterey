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
    let packageJSONPath = this.fs.join(path, 'package.json');
    let packageJSON;
    try {
      packageJSON = JSON.parse(await this.fs.readFile(packageJSONPath));
    } catch (e) {
      alert(`Error loading package.json: ${packageJSONPath}`);
      console.log(e);
    }

    if (packageJSON) {
      await this.addProject({
        name: packageJSON ? packageJSON.name : '',
        path: path
      });
    }
  }

  async addProject(projectObj) {
    // have all plugins evaluate the project
    this.pluginManager.evaluateProject(projectObj);

    this.state.projects.push(projectObj);

    await this.save();
  }

  hasProjects() {
    return this.state.projects.length > 0;
  }

  async save() {
    this.session.set('state', JSON.stringify(this.state));
  }

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
