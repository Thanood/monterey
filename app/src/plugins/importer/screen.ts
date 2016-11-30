import {autoinject} from 'aurelia-framework';
import {Main} from '../../main/main';
import {PluginManager, Notification, OS, TaskQueue} from '../../shared/index';

@autoinject()
export class Screen {
  project;
  tabs = [
    { element: null, title: 'Project-creation1', viewModel: './components/project-creation1' },
    { element: null, title: 'Project-creation2', viewModel: './components/project-creation2' },    
    { element: null, title: 'NPM',               viewModel: './components/npm' }
  ];
  
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
