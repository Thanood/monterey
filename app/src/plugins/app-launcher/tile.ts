import {PROCESSES, OS} from 'monterey-pal';
import {useView, autoinject} from 'aurelia-framework';
import {Notification}        from '../../shared/notification';

@useView('plugins/default-tile.html')
@autoinject()
export class AppLauncher {
  project;
  cmd: string;
  useShell: boolean;

  constructor(private notification: Notification) {
  }

  activate(model) {
    this.project = model.project;
    Object.assign(this, model.model);
  }

  async onClick() {
    if (!this.cmd) {
      this.notification.error('no cmd provided for this app launcher');
      return;
    }

    this.cmd = this.cmd.replace(/%path%/g, this.project.path);

    try {
      if(this.useShell) {
        OS.openItem(this.cmd);
      } else {
        await OS.exec(this.cmd, {});
      }
    } catch (e) {
      this.notification.error(`error executing cmd: ${e.message}`);
      console.log(e);
    }
  }
}
