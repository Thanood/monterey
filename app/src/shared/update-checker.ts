import 'fetch';
import {DialogService}          from 'aurelia-dialog';
import {HttpClient}             from 'aurelia-fetch-client';
import {LogManager, autoinject} from 'aurelia-framework';
import {FS}                     from 'monterey-pal';
import * as semver              from 'semver';
import {UpdateModal}            from './update-modal';
import {ApplicationState}       from './application-state';
import * as packageJSON         from 'root/package.json!';

const logger = LogManager.getLogger('project-manager');

@autoinject()
export class UpdateChecker {
  client: HttpClient;

  constructor(private dialogService: DialogService,
              private state: ApplicationState) {
    this.client = new HttpClient();
  }

  async checkUpdates() {
    if (!this.state.checkForUpdatesOnStartup) return;

    try {
      let latestRelease = await this.getLatestVersion();
      let latestVersion = latestRelease.tag_name;
      let currVersion: string = (<any>packageJSON).version;
      if (semver.compare(latestVersion, currVersion) > 0) {
        let model = {
          currentVersion: currVersion,
          release: latestRelease
        };

        await this.dialogService.open({ viewModel: UpdateModal, model: model });
      } else {
        logger.info(`Current version ${currVersion} is equal to the latest version (${latestVersion})`);
      }
    } catch(e) {
      logger.error('error during update check', e);
      // fail silently
    }
  }

  async getLatestVersion() {
      return this.client.fetch(`https://api.github.com/repos/monterey-framework/monterey/releases/latest`)
      .then(response => response.json());
  }
}