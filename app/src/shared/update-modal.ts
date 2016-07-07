import {autoinject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {ApplicationState} from './application-state';

@autoinject()
export class UpdateModal {
  release;
  currentVersion: string;

  constructor(private dialog: DialogController,
              private state: ApplicationState) {}

  activate(model) {
    this.release = model.release;
    this.currentVersion = model.currentVersion;
  }

  async closeAndDisable() {
    this.state.checkForUpdatesOnStartup = false;
    await this.state._save();
    this.dialog.cancel();
  }
}

