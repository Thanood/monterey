import {SESSION}    from 'monterey-pal';
import {LogManager} from 'aurelia-framework';

const logger = LogManager.getLogger('project-manager');

export class ApplicationState {
  /**
  * restores the application state from session
  */
  async _loadStateFromSession() {
    let state = await SESSION.get('state');
    if (state) {
      Object.assign(this, JSON.parse(state));
    } else {
      Object.assign(this, {
        projects: []
      });
    }

    logger.debug('Loaded state: ', this.state);
  }

  /**
  * Persists the state to session
  */
  async save() {
    let str = JSON.stringify(this.normalize(this.state));
    SESSION.set('state', str);
  }

  // JSON.stringify does not take getter properties into account
  // which sometimes lead to properties not being persisted into the session
  normalize(obj) {
    let normalized = {};
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let val = obj[key];
      if (Object.prototype.toString.call(val) === '[object Array]') {
        normalized[key] = [];
        for (let x = 0; x < val.length; x++) {
          normalized[key].push(this.normalize(val[x]));
        }
      } else if (val === Object(val)) {
        normalized[key] = this.normalize(val);
      } else {
        normalized[key] = obj[key];
      }
    }
    return normalized;
  }
}
