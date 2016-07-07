import 'fetch';
import {inject}        from 'aurelia-framework';
import {HttpClient}    from 'aurelia-fetch-client';
import {SESSION}       from 'monterey-pal';
import {DialogService} from 'aurelia-dialog';
import {GithubCreds}   from './github-creds';

@inject(DialogService)
export class GithubAPI {
  githubAPIUrl = 'https://api.github.com';
  client: HttpClient;
  _authConfigured = false;

  constructor(private dialogService: DialogService) {
    this.client = new HttpClient();
  }

  async getLatestRelease(owner, repo) {
    await this.confirmAuth();

    return this.client.fetch(`${this.githubAPIUrl}/repos/${owner}/${repo}/releases/latest`)
    .then(response => response.json());
  }

  async confirmAuth() {
    if (this._authConfigured) return;
    if (await SESSION.has('gitAuthorization')) {
      await this.setCreds();
    } else {
      let response = await this.dialogService.open({ viewModel: GithubCreds });
      if (!response.wasCancelled) {
        await this.setCreds();
      }
    }
  }

  async setCreds() {
    let authorization = await SESSION.get('gitAuthorization');
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
