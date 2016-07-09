import {useView, autoinject} from 'aurelia-framework';
import {TaskManager}      from '../../task-manager/task-manager';
import {withModal}        from '../../shared/decorators';
import {TaskManagerModal} from '../../task-manager/task-manager-modal';

@autoinject()
@useView('plugins/default-tile.html')
export class Tile {
  title: string;
  img: string;

  constructor(private taskManager: TaskManager) {
    this.title = 'Task manager';
    this.img = 'images/task-manager.png';
  }

  @withModal(TaskManagerModal)
  onClick() {}
}