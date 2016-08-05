import {SESSION}    from 'monterey-pal';
import {LogManager} from 'aurelia-framework';
import {Project}    from './project.ts';

const logger = LogManager.getLogger('project-manager');

export class ApplicationState {

  gitAuthorization: string;
  appLaunchers = [];
  projects: Array<Project> = [];

  /**
  * restores the application state from session
  */
  async _loadStateFromSession() {
    Object.assign(this, await SESSION.get('state'));

    logger.debug('Loaded state: ', this);
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
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let val = obj[key];
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
