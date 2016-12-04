import * as dragula from 'dragula';
import {PluginManager, Project, ApplicationState, SelectedProject, autoinject, bindable, EventAggregator, TaskQueue} from '../../../shared/index';

/**
 * This custom element gathers and renders tiles. It also uses dragula.js to
 * enable drag and drop support for these tiles
 */
@autoinject()
export class Tiles {
  tiles = [];
  dragContainer: Element;
  drake: any;
  subscriptions: Array<any> = [];
  @bindable showIrrelevant = false;

  constructor(private pluginManager: PluginManager,
              private taskQueue: TaskQueue,
              private ea: EventAggregator,
              private selectedProject: SelectedProject,
              private state: ApplicationState,
              private element: Element) {
    this.subscriptions.push(selectedProject.onChange((project) => {
      this.refreshTiles();
    }));

    this.subscriptions.push(ea.subscribe('RefreshTiles', () => this.refreshTiles()));
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

  clear() {
    // destroy dragula
    if (this.drake) {
      this.drake.destroy();
    }

    // remove all tiles from the screen
    this.tiles.splice(0);
  }

  refreshTiles() {
    this.clear();

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
