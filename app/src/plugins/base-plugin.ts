export class BasePlugin {
  // a plugin can override this function
  // this function is called whenever a project gets opened in monterey
  // and allows plugin to provide information about a project
  // for example, the JSPM plugin can look for a config.js and let monterey
  // know that the project is a JSPM project
  async evaluateProject(project) {
    return project;
  }


  // whenever a project gets selected monterey will ask all plugins
  // if they want to add tiles to the screen
  // the getTiles() function can return an array of tiles
  getTiles(project, showIrrelevant = false): Array<any> {
    return [];
  }

  async onNewSession(state) {
    return state;
  }

  async onProjectAdd(project) {
    return project;
  }

  async getProjectInfoSections(project) {
    return [];
  }

  async getTaskBarItems(project) {
    return [];
  }

  async resolvePostInstallWorkflow(project, workflow, pass: number) {
    return workflow;
  }
}
