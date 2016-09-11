import {autoinject} from 'aurelia-framework';
import {ApplicationState} from './application-state';

export interface Setting {
  title: string;
  type: 'string'|'boolean';
  identifier: string;
  visible?: boolean;
  value?: string|boolean|undefined;
  options?: Array<{ value: any, display: string }>;
}

@autoinject()
export class Settings {
  settings: Array<Setting> = [];

  constructor(private state: ApplicationState) {
  }

  /**
   * Adds a setting to the applicationstate when the setting
   * does not exist yet
   */
  addSetting(setting: Setting) {
    if (setting.visible === undefined) {
      setting.visible = true;
    }

    let set = this.getSetting(setting.identifier);
    if (!set) {
      this.settings.push(setting);

      // get the stored setting from the application state
      let val = this.state.settingValues.find(x => x.identifier === setting.identifier);
      if (val) {
        setting.value = val.value;
      }
    }
  }

  getSetting(identifier: string) {
    return this.settings.find(x => x.identifier === identifier);
  }

  getValue(identifier: string) {
    let setting = this.getSetting(identifier);
    return setting ? setting.value : null;
  }

  async setValue(identifier: string, value: any) {
    let setting = this.getSetting(identifier);
    if (setting) {
      setting.value = value;
    }
  }

  getSettings() {
    return this.settings;
  }

  async save() {
    this.state.settingValues = [];
    for (let setting of this.settings) {
      this.state.settingValues.push({
        identifier: setting.identifier,
        value: setting.value
      });
    }
    return await this.state._save();
  }
}

export class SettingValue {
  identifier: string;
  value: any;
}