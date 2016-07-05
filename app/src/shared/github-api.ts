import 'fetch';
import {HttpClient} from 'aurelia-fetch-client';

export class GithubAPI {
  githubAPIUrl = 'https://api.github.com';
  client: HttpClient;

  constructor() {
    this.client = new HttpClient();
  }

  getLatestRelease(owner, repo) {
    return this.client.fetch(`${this.githubAPIUrl}/repos/${owner}/${repo}/releases/latest`)
    .then(response => response.json());
  }
}
