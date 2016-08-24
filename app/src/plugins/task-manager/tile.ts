import {useView, autoinject} from 'aurelia-framework';
import {TaskManagerModal}    from './task-manager-modal';
import {withModal}           from '../../shared/decorators';
import {SelectedProject}     from '../../shared/selected-project';

@autoinject()
@useView('plugins/default-tile.html')
export class Tile {
  title: string;
  img;
  project;

  constructor(private selectedProject: SelectedProject) {
    this.title = 'Taskmanager';
    this.img = 'images/task-manager.png';
  }

  activate(model) {
    this.project = model.project;
    Object.assign(this, model.model);
  }

  @withModal(TaskManagerModal, function () { return { project: this.selectedProject.current }; })
  onClick() {}
}
