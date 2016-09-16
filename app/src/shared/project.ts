import {Task}        from '../plugins/task-manager/task';
import {CommandTree} from '../plugins/workflow/command-tree';

export interface Project {
  packageJSONPath?: string;
  name?: string;
  installNPM?: boolean;
  path: string;

  gulpfile?: string;
  gulptasks?: Array<string>;

  aureliaJSONPath?: string;
  webpackConfigPath?: string;
  typingsJSONPath?: string;
  projectJSONPath?: string;

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
  workflowTrees: Array<CommandTree> = [];
  favoriteCommands: Array<string>;

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

  addOrCreateWorkflow(name: string) {
    let workflow = this.workflowTrees.find(x => x.name === name);
    if (!workflow) {
      this.workflowTrees.push(new CommandTree({
        name: name,
        tile: true
      }));

      workflow = this.workflowTrees[0];
    }

    return workflow;
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

  isUsingTypings() {
    return !!this.typingsJSONPath;
  }

  isUsingDotnetCore() {
    return !!this.projectJSONPath;
  }
}