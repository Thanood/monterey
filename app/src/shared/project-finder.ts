import {autoinject}      from 'aurelia-framework';
import {FS}              from 'monterey-pal';
import {ProjectManager}  from '../shared/project-manager';

@autoinject()
export class ProjectFinder {

  constructor(private projectManager: ProjectManager) {
  }

  /**
  * Opens a folder dialog and adds the selected folder as a project
  */
  async openDialog() {
    let projectFolder: Array<string> = await FS.showOpenDialog({
      title: 'Select a project folder',
      properties: ['openDirectory']
    });

    if (projectFolder && projectFolder.length > 0) {
      return this.projectManager.addProjectByPath(projectFolder[0]);
    }

    return false;
  }
}
