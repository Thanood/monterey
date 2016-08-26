import {Task} from '../plugins/task-manager/task';

export interface Project {
  packageJSONPath?: string;
  name?: string;
  installNPM?: boolean;
  path: string;

  gulpfile?: string;
  gulptasks?: Array<string>;

  aureliaJSONPath?: string;

  webpackConfigPath?: string;

  jspmVersion?: string;
  configJsPath?: string;
  jspmDefinition?: string;

  // array of tile names, allows for reordering of tiles
  tiles?: Array<string>;

  // won't be save in session
  __meta__: any;
}

export class Project {
  appLaunchers?: Array<any> = [];

  constructor(project = {}) {    
    Object.assign(this, project);

    if (!this.__meta__) {
      this.__meta__ = {};
    }
    if (!this.__meta__.taskmanager) {
      this.__meta__.taskmanager = {
        tasks: []
      };
    }
  }

  isUsingGulp() {
    return !!this.gulpfile;
  }

  isUsingWebpack() {
    return !!this.webpackConfigPath;
  }

  isUsingAureliaCLI() {
    return !!this.aureliaJSONPath;
  }

  isUsingJSPM() {
    return !!(this.configJsPath && this.jspmVersion);
  }

  isUsingNPM() {
    return !!this.packageJSONPath;
  }
}