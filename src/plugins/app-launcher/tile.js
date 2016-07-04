import {PROCESSES} from 'monterey-pal';
import {useView}   from 'aurelia-framework';

@useView('plugins/default-tile.html')
export class AppLauncher {

  activate(model) {
    this.project = model.project;
    Object.assign(this, model.model);
  }

  onClick() {
    if (!this.cmd) {
      alert('no cmd provided for this app launcher');
      return;
    }

    this.cmd = this.cmd.replace(/%path%/g, this.project.path);

    try {
      PROCESSES.execChildProcess(this.cmd);
    } catch (e) {
      alert(`error executing cmd: ${e.message}`);
      console.log(e);
    }
  }
}
