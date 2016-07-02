import {PROCESSES} from 'monterey-pal';

export class AppLauncher {

  activate(model) {
    this.project = model.project;
    Object.assign(this, model.model);
  }

  onClick() {
    PROCESSES.execChildProcess(this.cmd);
  }
}
