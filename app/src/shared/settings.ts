import {autoinject} from 'aurelia-framework';
import {ApplicationState} from './application-state';

export interface Setting {
  title: string;
  type: 'string'|'boolean';
  identifier: string;
  value?: string|boolean|undefined;
}

@autoinject()
export class Settings {
  constructor(private state: ApplicationState) {}

  /**
   * Adds a setting to the applicationstate when the setting
   * does not exist yet
   */
  addSetting(setting: Setting) {
    let set = this.getSetting(setting.identifier);
    if (!set) {
      this.state.settings.push(setting);
    }
  }

  getSetting(identifier: string) {
    return this.state.settings.find(x => x.identifier === identifier);
  }

  getValue(identifier: string) {
    let setting = this.state.settings.find(x => x.identifier === identifier);
    return setting ? setting.value : null;
  }

  getSettings() {
    return this.state.settings;
  }

  async save() {
    return await this.state._save();
  }
}