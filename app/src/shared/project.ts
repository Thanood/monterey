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

  // won't be save in session
  __meta__?: {
    taskrunner: {
      selectedTask?: Task,
      tasks?: Array<Task>,
      runningTasks?: Array<Task>
    }
  };
}

export class Project {
  constructor(project = {}) {
    Object.assign(this, project);
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