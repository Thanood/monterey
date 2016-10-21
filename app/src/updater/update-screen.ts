import {autoinject, GithubAPI, I18N, FS, withModal, Notification, LogManager, Logger} from '../shared/index';
import * as showdown from 'showdown';
import {UpdateModal} from './update-modal';

const logger = <Logger>LogManager.getLogger('update-screen');

showdown.extension('targetblank', function () {
  return [
      {
        type:   'output',
        regex: '<a(.*?)>',
        replace: function (match, content) {
            return '<a target="_blank"' + content + '>';
        }
      }
  ];
});

@autoinject()
export class UpdateScreen {
  error: string;
  currentVersion: string;
  releases: Array<Release> = [];
  latestRelease: Release;
  loading = true;

  constructor(private github: GithubAPI,
              private i18n: I18N,
              private notification: Notification) {
  }

  async attached() {
    let packageJSON = JSON.parse(await FS.readFile(FS.join(FS.getRootDir(), 'package.json')));
    this.currentVersion = packageJSON.version;

    logger.info('Fetching releases from GitHub....');

    try {
      let releases = await this.github.getReleases('monterey-framework/monterey');
      let converter = new showdown.Converter({ extensions: ['targetblank'] });

      logger.info(`Found ${releases.length} releases`);

      for (let release of releases) {
        // convert markdown to html
        release.body = converter.makeHtml(release.body);
        release.created_at = new Date(release.created_at);
      }

      this.latestRelease = releases[0];
      this.releases = releases;
    } catch (error) {
      if (error.status === 401) {
        this.error = this.i18n.tr('github-unauthorized');
        logger.error('GitHub returned Unauthorized');
      } else {
        logger.error(`GitHub returned error: ${JSON.stringify(error)}`);
      }
    }

    this.loading = false;
  }

  @withModal(UpdateModal)
  installUpdate() {}
}

export interface Release {
  body: string;
  created_at: Date;
}