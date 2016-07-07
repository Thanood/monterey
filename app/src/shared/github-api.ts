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

  async getLatestRelease(owner, repo) {
    await this.confirmAuth();

    return this.client.fetch(`${this.githubAPIUrl}/repos/${owner}/${repo}/releases/latest`)
    .then(response => response.json());
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
