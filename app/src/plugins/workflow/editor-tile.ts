import {Main}        from '../../main/main';
import {autoinject, useView} from '../../shared/index';

@useView('plugins/default-tile.html')
@autoinject()
export class Tile {
  title: string = 'Workflows';
  img: string = 'images/workflow-editor.png';
  tooltip = 'tooltip-workflow-editor';

  constructor(private main: Main) {
  }

  activate(model) {
    Object.assign(this, model.model);
  }

  async onClick() {
    this.main.activateScreen('plugins/workflow/screen');
  }
}
