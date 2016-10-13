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

  async getLatestReleaseZIP(repository: string) {
    await this.confirmAuth();

    return this.client.fetch(`${this.githubAPIUrl}/repos/${repository}/releases/latest`)
      .then(response => {

        let error;
        let result;

        switch (response.status) {
          case 200:
            result = response.json();
            break;
          case 401:
            error = new Error(`Github returned ${response.statusText}, please check you credentials and try again`);
            break;
          case 404:
            // if we get a 404 then there probably hasn't been a release yet
            // then return the zip url of the master branch
            result = {
              zipball_url: `https://github.com/${repository}/archive/master.zip`,
              tag_name: 'master'
            };
            break;
          default:
            error = new Error(`Github returned ${response.statusText}`);
        }

        if (error) {
          throw error;
        } else {
          return result;
        }

      });
  }

  async getTags(repository: string) {
    return this.client.fetch(`${this.githubAPIUrl}/repos/${repository}/tags`)
    .then(response => response.json());
  }

  async getLatestTag(repository: string) {
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

  async getContents(repository: string, path: string = '') {
    return this.client.fetch(`${this.githubAPIUrl}/repos/${repository}/contents/${path}`);
  }

  async confirmAuth() {
    if (this._authConfigured && this.state.gitAuthorization) {
      return true;
    }

    if (this.state.gitAuthorization) {
      await this.setCreds();
      return true;
    } else {
      let response = await this.dialogService.open({ viewModel: GithubCreds });
      if (!response.wasCancelled) {
        await this.setCreds();
        return true;
      }
    }

    return false;
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
