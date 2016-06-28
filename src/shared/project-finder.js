import {inject}          from 'aurelia-framework';
import {Fs}              from '../shared/abstractions/fs';
import {ProjectManager}  from '../shared/project-manager';

@inject(ProjectManager, Fs)
export class ProjectFinder {

  constructor(projectManager, fs) {
    this.projectManager = projectManager;
    this.fs = fs;
  }

  /**
  * Opens a folder dialog and adds the selected folder as a project
  */
  async openDialog() {
    let projectFolder = await this.fs.showOpenDialog({
      title: 'Select a project folder',
      properties: ['openDirectory']
    });

    if (projectFolder && projectFolder.length > 0) {
      this.projectManager.addProjectByPath(projectFolder[0]);
      return true;
    }

    return false;
  }
}
