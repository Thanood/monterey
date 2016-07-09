import 'fetch';
import {autoinject}       from 'aurelia-framework';
import {HttpClient}       from 'aurelia-fetch-client';
import {ApplicationState} from './application-state';
import {DialogService}    from 'aurelia-dialog';
import {GithubCreds}      from './github-creds';

@autoinject()
export class GithubAPI {
  githubAPIUrl = 'https://api.github.com';
  client: HttpClient;
  _authConfigured = false;

  constructor(private dialogService: DialogService,
              private state: ApplicationState) {
    this.client = new HttpClient();
  }

  async getLatestReleaseZIP(repository) {
    await this.confirmAuth();

    return this.client.fetch(`${this.githubAPIUrl}/repos/${repository}/releases/latest`)
    .then(response => {
      // if we get a 404 then there probably hasn't been a release yet
      // then return the zip url of the master branch
      if (response.status === 404) {
        return {
          zipball_url: `https://github.com/${repository}/archive/master.zip`,
          tag_name: 'master'
        };
      }

      return response.json();
    });
  }

  async getTags(repository) {
    await this.confirmAuth();

    return this.client.fetch(`${this.githubAPIUrl}/repos/${repository}/tags`)
    .then(response => response.json());
  }

  async getLatestTag(repository) {
    await this.confirmAuth();

    return this.client.fetch(`${this.githubAPIUrl}/repos/${repository}/releases/latest`)
    .then(response => {
      if (response.status === 404) {
        return 'master';
      } else {
        return response.json()
        .then(data => data.tag_name);
      }
    });
  }

  async confirmAuth() {
    if (this._authConfigured) return;
    if (this.state.gitAuthorization) {
      await this.setCreds();
    } else {
      let response = await this.dialogService.open({ viewModel: GithubCreds });
      if (!response.wasCancelled) {
        await this.setCreds();
      }
    }
  }

  async setCreds() {
    let authorization = this.state.gitAuthorization;
    this.client.configure(config => {
      config.withDefaults(<any>{
        headers: {
          'Authorization': `Basic ${authorization}`
        }
      });
    });
    this._authConfigured = true;
  }
}
