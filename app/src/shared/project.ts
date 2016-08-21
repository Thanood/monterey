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
  __meta__: {
    taskmanager: {
      tasks: Array<Task>
    }
  };
}

export class Project {
  appLaunchers?: Array<any> = [];

  constructor(project = {}) {
    Object.assign(this, project);

    this.__meta__ = {
      taskmanager: {
        tasks: []
      }
    };
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
}

export interface ProjectTask {
  id?: number;
  command: string;
  parameters: Array<string>;
}

export interface Task {
  id: number;
  name: string;
  running: boolean;
  process: any;
  command: string;
  parameters: Array<string>;
  logs: Array<{ message: string }>;
}