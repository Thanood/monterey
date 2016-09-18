import {autoinject}      from 'aurelia-framework';
import {FS}              from 'monterey-pal';
import {Notification}    from '../shared/notification';
import {ProjectManager}  from '../shared/project-manager';
import {Project}         from '../shared/project';

/**
* Opens a folder dialog and adds the selected folder as a project
*/
@autoinject()
export class ProjectFinder {

  constructor(private projectManager: ProjectManager,
              private notification: Notification) {
  }

  async openDialog(): Promise<Array<Project> | boolean> {
    let projectFolders: Array<string> = await FS.showOpenDialog({
      title: 'Select a project folder',
      properties: ['openDirectory', 'multiSelections']
    });

    if (projectFolders) {
      let projects = [];
      for (let x = 0; x < projectFolders.length; x++) {
        projects.push(await this.projectManager.addProjectByPath(projectFolders[x]));
      }

      return projects;
    }

    return false;
  }
}
