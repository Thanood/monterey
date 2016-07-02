// need to abstract this out
// const exec = require('child_process').exec;

export class AppLauncher {

  activate(model) {
    this.project = model.project;
    Object.assign(this, model.model);
  }

  onClick() {
    exec(this.cmd);
  }
}
