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

    return this.execute(`${this.githubAPIUrl}/repos/${repository}/releases/latest`)
    .catch(error => {
      if (error.statusCode === 404) {
        // if we get a 404 then there probably hasn't been a release yet
        // then return the zip url of the master branch
        return {
          zipball_url: `https://github.com/${repository}/archive/master.zip`,
          tag_name: 'master'
        };
      }

      throw error;
    });
  }

  /**
   * Executes a request, throw error ({ status: number, message: string }) when statusCode
   * is something else than 200
   */
  async execute(url: string): Promise<any> {
    return this.client.fetch(url)
    .then(response => {
      if (response.status !== 200) {
        throw {
          status: response.status,
          message: response.statusText
        };
      } else {
        return response.json();
      }
    });
  }

  async getTags(repository: string) {
    return this.execute(`${this.githubAPIUrl}/repos/${repository}/tags`);
  }

  async getLatestRelease(repository: string) {
    return this.execute(`${this.githubAPIUrl}/repos/${repository}/releases/latest`);
  }

  async getReleases(repository: string) {
    return this.execute(`${this.githubAPIUrl}/repos/${repository}/releases`);
  }

  async getLatestTag(repository: string) {
    return this.execute(`${this.githubAPIUrl}/repos/${repository}/releases/latest`)
    .then(response => {
      return response.tag_name;
    })
    .catch(response => {
      if (response.status === 404) {
        return 'master';
      }
    });
  }

  async getContents(repository: string, path: string = '') {
    return this.execute(`${this.githubAPIUrl}/repos/${repository}/contents/${path}`);
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
