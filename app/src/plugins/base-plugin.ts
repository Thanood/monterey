import {Project} from '../shared/project';

/**
 * A plugin is a component that can be used via a tile or a button in the menubar.
 * API: https://aurelia-ui-toolkits.gitbooks.io/monterey-technical-documentation/content/plugin_system.html#34-plugin-api
 */
export class BasePlugin {
  async evaluateProject(project: Project) {
    return project;
  }

  getTiles(project: Project, showIrrelevant = false): Array<any> {
    return [];
  }

  async onNewSession(state) {
    return state;
  }

  async onProjectAdd(project: Project) {
    return project;
  }

  async getProjectInfoSections(project: Project) {
    return [];
  }

  async getTaskBarItems(project: Project) {
    return [];
  }

  async resolvePostInstallWorkflow(project: Project, workflow, pass: number) {
    return workflow;
  }

  async getCommandServices(project: Project): Promise<Array<any>> {
    return [];
  }
}
