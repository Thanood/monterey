// need to abstract this out
const exec = require('child_process').exec;

export class AppLauncher {
  // user should be able to modify this
  img = 'http://icons.iconarchive.com/icons/dakirby309/simply-styled/128/File-Explorer-icon.png';
  path = 'explorer'
  title = 'File explorer';

  activate(model) {
    this.project = model.project;
    this.plugin = model.plugin;
  }

  launch() {
    exec(`${this.path} ${this.project.path}`);
  }
}
