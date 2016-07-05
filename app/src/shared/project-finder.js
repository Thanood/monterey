import {inject}          from 'aurelia-framework';
import {FS}              from 'monterey-pal';
import {ProjectManager}  from '../shared/project-manager';

@inject(ProjectManager)
export class ProjectFinder {

  constructor(projectManager) {
    this.projectManager = projectManager;
  }

  /**
  * Opens a folder dialog and adds the selected folder as a project
  */
  async openDialog() {
    let projectFolder = await FS.showOpenDialog({
      title: 'Select a project folder',
      properties: ['openDirectory']
    });

    if (projectFolder && projectFolder.length > 0) {
      return this.projectManager.addProjectByPath(projectFolder[0]);
    }

    return false;
  }
}
