import {autoinject, bindable} from 'aurelia-framework';
import {PluginManager}        from '../../shared/plugin-manager';
import {Project}              from '../../shared/project';
import {ApplicationState}     from '../../shared/application-state';
import * as dragula           from 'dragula';
import {TaskQueue}            from 'aurelia-task-queue';

@autoinject()
export class Tiles {
  @bindable selectedProject: Project;
  tiles = [];
  dragContainer: Element;
  drake: any;
  @bindable showIrrelevant = false;

  constructor(private pluginManager: PluginManager,
              private taskQueue: TaskQueue,
              private state: ApplicationState,
              private element: Element) {
  }

  selectedProjectChanged() {
    this.refreshTiles();
  }

  showIrrelevantChanged() {
    this.refreshTiles();
  }

  executeTile(tile) {
    try {
      tile.currentViewModel.onClick();
    }
    catch(err) {
      console.log(err);
    }
  }

  refreshTiles() {
    // destroy dragula
    if (this.drake) {
      this.drake.destroy();
    }

    // remove all tiles from the screen
    for (let i = this.tiles.length - 1; i >= 0; i--) {
      this.tiles.splice(i, 1);
    }

    // we're done if no project has been selected
    if (!this.selectedProject) {
      return;
    }

    // get a list of tiles to show from every plugin
    let tiles = this.pluginManager.getTilesForProject(this.selectedProject, this.showIrrelevant);

    // apply sorting to the tiles based on the array of tile names defined in the project
    if (this.selectedProject.tiles) {
      tiles.sort((a, b) => {
        let indexA = this.selectedProject.tiles.indexOf(a.name);
        let indexB = this.selectedProject.tiles.indexOf(b.name);
        if (indexA === -1 || indexB === -1) return -1;
        return indexA > indexB ? 1 : -1;
      });
    }

    // render tiles on the screen
    tiles.forEach(tile => this.tiles.push(tile));

    this.taskQueue.queueTask(() => {
      this.drake = dragula([this.dragContainer], {
        moves: el => {
          return el.classList.contains('tile');
        }
      }).on('drop', () => this.saveTileOrder());
    });
  }

  async saveTileOrder() {
    let composeElements = this.element.querySelectorAll('compose');
    let composes = Array.prototype.slice.call(composeElements);

    let tileNames = composes.map(elem => elem.id);

    this.selectedProject.tiles = tileNames;

    await this.state._save();
  }
}
