import {autoinject, GithubAPI, DialogController, I18N, FS} from '../shared/index';
import * as showdown from 'showdown';

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
export class UpdateModal {
  error: string;
  currentVersion: string;
  releases: Array<Release> = [];
  latestRelease: Release;
  loading = true;

  constructor(private dialogController: DialogController,
              private github: GithubAPI,
              private i18n: I18N) {
  }

  async attached() {
    let packageJSON = JSON.parse(await FS.readFile(FS.join(FS.getRootDir(), 'package.json')));
    this.currentVersion = packageJSON.version;

    try {
      let releases = await this.github.getReleases('monterey-framework/monterey');
      let converter = new showdown.Converter({ extensions: ['targetblank'] });

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
      }
    }

    this.loading = false;

    // this.github.getLatestRelease('monterey-framework/monterey')
    // .then(release => {
    //   this.version = release.name;
    //   this.released_at = new Date(release.created_at);

    //   let converter = new showdown.Converter({ extensions: ['targetblank'] });
    //   this.changelog = converter.makeHtml(release.body);
    // })
    // .catch(error => {
    //   if (error.status === 401) {
    //     this.error = this.i18n.tr('github-unauthorized');
    //   }
    // });
  }
}

export interface Release {
  body: string;
  created_at: Date;
}