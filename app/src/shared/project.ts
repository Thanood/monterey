import {Task}        from '../plugins/task-manager/task';
import {CommandTree} from '../plugins/workflow/command-tree';
import {Command}     from '../plugins/task-manager/commands/command';

export interface Project {
  packageJSONPath?: string;

  /**
   * What is the project called? Shown in the ProjectList
   */
  name?: string;
  installNPM?: boolean;

  /**
   * The root path of the project
   */
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

  /*
   * array of tile identifiers, allows for reordering of tiles
   */
  tiles?: Array<string>;

  /**
   * Won't be save in session, can be used to hold temporary data
   */
  __meta__: any;
}

/**
 * A Project (in its most basic form) is an object with a `path` which is the root path of the project.
 * Often the Project contains everything Monterey knows about a project's setup
 */
export class Project {
  appLaunchers?: Array<any> = [];
  workflowTrees: Array<CommandTree> = [];
  favoriteCommands: Array<Command> = [];

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