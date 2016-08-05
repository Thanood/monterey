import {autoinject}       from 'aurelia-framework';
import {PluginManager}    from '../../shared/plugin-manager';
import {EventAggregator, Subscription}  from 'aurelia-event-aggregator';

@autoinject()
export class TaskBar {
  subscription: Subscription;
  items: Array<string> = [];

  constructor(private pluginManager: PluginManager,
              private ea: EventAggregator) {
    this.subscription = this.ea.subscribe('SelectedProjectChanged', (project) => {
      this.updateTaskBar(project);
    });
  }

  async updateTaskBar(project) {
    this.items = await this.pluginManager.getTaskBarItems(project);
  }

  detached() {
    this.subscription.dispose();
  }
}
