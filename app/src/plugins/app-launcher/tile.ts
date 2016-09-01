import {useView, autoinject, LogManager} from 'aurelia-framework';
import {OS}              from 'monterey-pal';
import {Logger}          from 'aurelia-logging';
import {SelectedProject} from '../../shared/selected-project';
import {Notification}    from '../../shared/notification';

const logger = <Logger>LogManager.getLogger('app-launcher');

@useView('plugins/default-tile.html')
@autoinject()
export class AppLauncher {
  cmd: string;
  useShell: boolean;

  constructor(private notification: Notification,
              private selectedProject: SelectedProject) {
  }

  activate(model) {
    Object.assign(this, model.model);
  }

  async onClick() {
    if (!this.cmd) {
      this.notification.error('no cmd provided for this app launcher');
      return;
    }

    this.cmd = this.cmd.replace(/%path%/g, this.selectedProject.current.path);
    this.cmd = this.cmd.replace(/%url%/g, this.selectedProject.current.__meta__.url || 'http://localhost:9000');

    logger.info(`going to run cmd: "${this.cmd}", ${this.useShell ? 'with shell' : 'without shell'}`);

    try {
      if(this.useShell) {
        OS.openItem(this.cmd);
      } else {
        await OS.exec(this.cmd, {});
      }
    } catch (e) {
      this.notification.error(`error executing cmd: ${e.message}`);
    }
  }
}
