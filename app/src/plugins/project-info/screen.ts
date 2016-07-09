import {autoinject}    from 'aurelia-framework';
import {PluginManager} from '../../shared/plugin-manager';

@autoinject()
export class Screen {
  project;
  sections = [];

  constructor(private pluginManager: PluginManager) {
  }

  async activate(model) {
    this.project = model.selectedProject;

    this.pluginManager.plugins.forEach(async plugin => {
      let sections = await plugin.getProjectInfoSections(this.project);
      (sections || []).forEach(section => {
        if (!section.model) {
          section.model = {
            project: this.project
          };
        }

        this.sections.push(section);
      });
    });
  }
}
