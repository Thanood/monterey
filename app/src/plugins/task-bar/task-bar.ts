import {autoinject}       from 'aurelia-framework';
import {EventAggregator}  from 'aurelia-event-aggregator';
import {PluginManager}    from '../../shared/plugin-manager';
import {SelectedProject}  from '../../shared/selected-project';

@autoinject()
export class TaskBar {
  subscriptions: Array<any> = [];
  items: Array<string> = [];

  constructor(private pluginManager: PluginManager,
              private selectedProject: SelectedProject,
              private ea: EventAggregator) {
    this.subscriptions.push(ea.subscribe('SettingsChanged', () => {
      this.updateTaskBar(this.selectedProject.current);
    }));

    this.subscriptions.push(selectedProject.onChange((project) => {
      this.updateTaskBar(project);
    }));

    if (this.selectedProject.current) {
      this.updateTaskBar(this.selectedProject.current);
    }
  }

  async updateTaskBar(project) {
    this.items = await this.pluginManager.getTaskBarItems(project);
  }

  detached() {
    this.subscriptions.forEach(sub => sub.dispose());
  }
}
