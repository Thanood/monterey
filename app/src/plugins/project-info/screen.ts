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

    // allow plugins to provide a list of view/viewmodels that should be rendered here
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

  attached() {
    let c = new Clipboard('.copy-btn', {
        text: function(trigger) {
          return (<any>$('.copyable-item')).text();
        }
    });

    c.on('success', function(e) {
      alert('copied project information to clipboard');
    });

    c.on('error', function(e) {
      alert(`failed to copy project information to clipboard: ${e.text}`);
      console.log(e);
    });
  }
}
