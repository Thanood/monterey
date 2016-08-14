import {SESSION}    from 'monterey-pal';
import {Project}    from './project';

export class ApplicationState {

  gitAuthorization: string;
  projects: Array<Project> = [];
  appLaunchers: Array<any> = [];
  endpoints = {
    montereyRegistry: 'https://raw.githubusercontent.com/monterey-framework/registries/master/',
    npmRegistry: 'https://registry.npmjs.org/',
    githubApi: 'https://api.github.com/',
    github: 'https://github.com/'
  };

  /**
  * restores the application state from session
  */
  async _loadStateFromSession() {
    Object.assign(this, await SESSION.get('state'));

    for (let i = 0; i < this.projects.length; i++) {
      this.projects[i] = new Project(this.projects[i]);
    }
  }

  async _isNew(): Promise<boolean> {
    return !(await SESSION.has('state'));
  }

  /**
  * Persists the state to session
  */
  async _save() {
    await SESSION.set('state', this._normalize(this));
  }

  // JSON.stringify does not take getter properties into account
  // which sometimes lead to properties not being persisted into the session
  _normalize(obj) {
    let normalized = {};
    let ignoreKeys = ['__meta__'];
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let val = obj[key];

      if (ignoreKeys.indexOf(key) > -1) {
        continue;
      }

      if (Object.prototype.toString.call(val) === '[object Array]') {
        // here we have an array
        normalized[key] = [];
        for (let x = 0; x < val.length; x++) {
          // if it's an array of object, normalize all objects in the array
          if (val[x] === Object(val[x])) {
            normalized[key].push(this._normalize(val[x]));
          } else {
            // strings, integers etc can be copied without normalization
            normalized[key].push(val[x]);
          }
        }
      } else if (val === Object(val)) {
        normalized[key] = this._normalize(val);
      } else {
        normalized[key] = obj[key];
      }
    }
    return normalized;
  }
}
