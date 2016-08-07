export interface Project {
  packageJSONPath?: string;
  name?: string;
  installNPM?: boolean;
  path: string;

  gulpfile?: string;

  // for aurelia cli this is 'au run --watch'
  // for gulp this could be 'gulp watch'
  // for webpack this could be 'npm start'
  tasks?: Array<ProjectTask>;

  aureliaJSONPath?: string;

  webpackConfigPath?: string;

  jspmVersion?: string;
  configJsPath?: string;
  jspmDefinition?: string;
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