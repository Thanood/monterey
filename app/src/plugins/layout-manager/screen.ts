import {Main} from '../../main/main';
import {PluginManager, Notification, OS, autoinject, TaskQueue} from '../../shared/index';

@autoinject()
export class Screen {
  project;
  
  constructor(private pluginManager: PluginManager,
              private taskQueue: TaskQueue,
              private notification: Notification,
              private main: Main) {
  }

  async activate(model) {
    this.project = model.selectedProject;
  }

  attached() {
    // allow plugins to provide a list of view/viewmodels that should be rendered here
  }


  goBack() {
    this.main.returnToPluginList();
  }

  detached() {
  }
}
