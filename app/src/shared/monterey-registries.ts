import 'fetch';
import {HttpClient} from 'aurelia-fetch-client';

export class MontereyRegistries {
  endpoint = 'https://monterey-framework.github.io/registries/';
  client: HttpClient;
  cache = {
    templates: null,
    gistrun: null,
    gitbooks: null
  };

  constructor() {
    this.client = new HttpClient();
    this.client.configure(config => config.withBaseUrl(this.endpoint));
  }

  async getTemplates(): Promise<Array<any>> {
    if (this.cache.templates) {
      return this.cache.templates;
    }

    return this.client.fetch(`project-templates.json`)
    .then(response => response.json())
    .then(data => { this.cache.templates = data.templates; return data.templates; });
  }

  async getGistRun() {
    if (this.cache.gistrun) {
      return this.cache.gistrun;
    }

    return this.client.fetch(`gistrun.json`)
    .then(response => response.json())
    .then(data => { this.cache.gistrun = data; return data; });
  }

  async getGitbooks() {
    if (this.cache.gitbooks) {
      return this.cache.gitbooks;
    }

    return this.client.fetch(`gitbooks.json`)
    .then(response => response.json())
    .then(data => { this.cache.gitbooks = data; return data; });
  }
}