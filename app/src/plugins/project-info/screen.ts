import {autoinject, TaskQueue} from 'aurelia-framework';
import {PluginManager}         from '../../shared/plugin-manager';
import {Notification}          from '../../shared/notification';
import {OS}                    from 'monterey-pal';
import {Main}                  from '../../main/main';

@autoinject()
export class Screen {
  project;
  sections = [];
  loading = true;
  items: { key: string, value: string }[] = [];
  clipboard: Clipboard;

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
    this.pluginManager.plugins.forEach(async (plugin) => {
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

    // loading all system information can take a while, so push this task on the taskqueue
    // without this, the spinner would not show
    this.taskQueue.queueTask(() => this.loadInfo());

    this.initializeClipboard();
  }

  initializeClipboard() {
    this.clipboard = new Clipboard('.copy-btn', {
        text: (trigger) => {
          return this.getMarkdown();
        }
    });

    this.clipboard.on('success', (e) => {
      this.notification.success('copied project information to clipboard');
    });

    this.clipboard.on('error', (e) => {
      this.notification.error(`failed to copy project information to clipboard: ${e.text}`);
      console.log(e);
    });
  }

  loadInfo() {
    this.items.push({ key: 'Project name', value: this.project.name });
    this.items.push({ key: 'Project path:', value: this.project.path });
    this.items.push({ key: 'NodeJS:', value: OS.getNodeVersion() });
    this.items.push({ key: 'NPM:', value: OS.getNPMVersion() });
    this.items.push({ key: 'Electron:', value: OS.getElectronVersion() });
    this.items.push({ key: 'Chrome:', value: OS.getChromeVersion() });
    this.items.push({ key: 'Operating system:', value: OS.getPlatform() });

    this.loading = false;
  }

  getMarkdown() {
    let markdown = '';
    $('.copyable-item').each((index, item) => {
      let key = $(item).find('.key').text();
      if (key) {
        markdown += '* **' + key + '**\r\n';
      }

      let val = $(item).find('.value').text();
      if (val) {
        markdown += val + '\r\n';
      }
    });
    return markdown;
  }

  goBack() {
    this.main.returnToPluginList();
  }

  detached() {
    this.clipboard.destroy();
  }
}
