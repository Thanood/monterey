import {LogManager}             from 'aurelia-framework';
import {Logger}                 from 'aurelia-logging';
import {SESSION, FS}            from 'monterey-pal';
import {Project}                from './project';

const logger = <Logger>LogManager.getLogger('application-state');

export class ApplicationState {

  gitAuthorization: string;
  projects: Array<Project> = [];
  appLaunchers: Array<any> = [];
  endpoints = {
    montereyRegistry: 'https://monterey-framework.github.io/registries/',
    npmRegistry: 'https://registry.npmjs.org/',
    githubApi: 'https://api.github.com/',
    github: 'https://github.com/'
  };

  /**
  * restores the application state from session
  */
  async _loadStateFromSession() {
    Object.assign(this, await SESSION.get(this._getStateIdentifier()));

    for (let i = 0; i < this.projects.length; i++) {
      this.projects[i] = new Project(this.projects[i]);
    }
  }

  async _isNew(): Promise<boolean> {
    return !(await SESSION.has(this._getStateIdentifier()));
  }

  /**
  * Persists the state to session
  */
  async _save() {
    await SESSION.set(this._getStateIdentifier(), this._normalize(this));
    logger.info('State saved');
  }

  // by using the path as identifier we can have a different state for dev and actual use
  _getStateIdentifier() {
    let id = `state-${FS.getRootDir()}`;

    // electron-json-storage does not handle special characters well
    return id.replace(/[`~!@#$%^&*()_|+=?;:'",.<>\{\}\[\]\\\/]/gi, '');
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
