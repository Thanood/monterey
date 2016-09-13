import {autoinject}      from 'aurelia-framework';
import {BasePlugin}      from '../base-plugin';
import {PluginManager}   from '../../shared/plugin-manager';
import {Project}         from '../../shared/project';
import {CommandWorkflow} from '../../project-installation/command-workflow';

export function configure(aurelia) {
  let pluginManager = <PluginManager>aurelia.container.get(PluginManager);

  pluginManager.registerPlugin(aurelia.container.get(Plugin));
}

@autoinject()
export class Plugin extends BasePlugin {
  getTiles(project: Project, showIrrelevant) {
    let cmdWorkflow = new CommandWorkflow({
      name: 'Run',
      command: {
        command: 'gulp',
        args: ['watch']
      }
    });

    let cmdWorkflows = [cmdWorkflow];
    let tiles = [];

    for (let x of cmdWorkflows) {
      tiles.push({
        name: `workflow-${x.name}`,
        model: { title: x.name, commandWorkflow: x },
        viewModel: 'plugins/workflows/tile'
      });
    }

    return tiles;
  }
}