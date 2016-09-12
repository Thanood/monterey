import {autoinject, bindable} from 'aurelia-framework';
import {PluginManager}        from '../../shared/plugin-manager';
import {Project}              from '../../shared/project';
import {ApplicationState}     from '../../shared/application-state';
import {SelectedProject}      from '../../shared/selected-project';
import * as dragula           from 'dragula';
import {TaskQueue}            from 'aurelia-task-queue';

@autoinject()
export class Tiles {
  tiles = [];
  dragContainer: Element;
  drake: any;
  subscriptions: Array<any> = [];
  @bindable showIrrelevant = false;

  constructor(private pluginManager: PluginManager,
              private taskQueue: TaskQueue,
              private selectedProject: SelectedProject,
              private state: ApplicationState,
              private element: Element) {
    this.subscriptions.push(selectedProject.onChange((project) => {
      this.refreshTiles();
    }));
  }

  showIrrelevantChanged() {
    this.refreshTiles();
  }

  executeTile(tile) {
    try {
      tile.currentViewModel.onClick();
    }
    catch (err) {
      console.log(err);
    }
  }

  refreshTiles() {
    // destroy dragula
    if (this.drake) {
      this.drake.destroy();
    }

    // remove all tiles from the screen
    this.tiles.splice(0);

    // we're done if no project has been selected
    if (!this.selectedProject.current) {
      return;
    }

    // get a list of tiles to show from every plugin
    let tiles = this.pluginManager.getTilesForProject(this.selectedProject.current, this.showIrrelevant);

    // apply sorting to the tiles based on the array of tile names defined in the project
    if (this.selectedProject.current.tiles) {
      tiles.sort((a, b) => {
        let indexA = this.selectedProject.current.tiles.indexOf(a.name);
        let indexB = this.selectedProject.current.tiles.indexOf(b.name);
        if (indexA === -1 || indexB === -1) return -1;
        return indexA > indexB ? 1 : -1;
      });
    }

    // render tiles on the screen
    tiles.forEach(tile => this.tiles.push(tile));

    // after aurelia has finished adding the tiles on the screen,
    // initialize dragula for drag and drop support
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

    this.selectedProject.current.tiles = tileNames;

    await this.state._save();
  }

  detached() {
    this.subscriptions.forEach(sub => sub.dispose());
  }
}
