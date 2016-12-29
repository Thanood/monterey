import 'fetch';
import {HttpClient}       from 'aurelia-fetch-client';
import {ApplicationState} from './application-state';
import {autoinject}       from 'aurelia-framework';
import {RandomNumber}     from './random-number';

@autoinject
export class MontereyRegistries {
  state: ApplicationState;
  client: HttpClient;
  cache = {
    templates: null,
    gistrun: null,
    gitbooks: null,
    appLaunchers: null
  };

  constructor(state: ApplicationState) {
    this.state = state;
  }

  getClient() {
    if (this.client) {
      return this.client;
    }

    this.client = new HttpClient();
    this.client.configure(config => config.withBaseUrl(this.state.endpoints.montereyRegistry));
    return this.client;
  }

  async getTemplates(): Promise<Array<any>> {
    if (this.cache.templates) {
      return this.cache.templates;
    }

    return this.getClient().fetch(`project-templates.json`)
    .then(response => response.json())
    .then(data => { this.cache.templates = (data as any).templates; return (data as any).templates; });
  }

  async getGistRun() {
    if (this.cache.gistrun) {
      return this.cache.gistrun;
    }

    return this.getClient().fetch(`gistrun.json`)
    .then(response => response.json())
    .then(data => { this.cache.gistrun = data; return data; });
  }

  async getGitbooks() {
    if (this.cache.gitbooks) {
      return this.cache.gitbooks;
    }

    return this.getClient().fetch(`gitbooks.json`)
    .then(response => response.json())
    .then(data => { this.cache.gitbooks = data; return data; });
  }

  async getAppLaunchers() {
    if (this.cache.appLaunchers) {
      return this.cache.appLaunchers;
    }

    return this.getClient().fetch(`app-launchers.json`)
    .then(response => response.json())
    .then(data => { this.cache.appLaunchers = data; return data; });
  }

  async getAppLauncherData(platform, path) {
    let data = await this.getClient().fetch(`launchers/${platform}/${path}/launcher.json`)
    .then(response => response.json())
    .then(json => {
      // should be valid because json is actually "any" and not "Response"
      return json as any;
    });

    // Get the icon as a blob
    let imagePath = `launchers/${platform}/${path}/${data.img}`;
    let imageBuffer;
    let image = await this.getClient().fetch(imagePath);
    let blob = await image.blob();

    // Read the blob into an array buffer as a data URL
    // Is there a less verbose way of doing this?
    let fileReader = new FileReader();
    let readerPromise = new Promise(function(resolve, reject){
      fileReader.onload = resolve;
    }).then((res: any) => {
      imageBuffer = res.target.result;
    });
    fileReader.readAsDataURL(blob);
    await readerPromise;

    return {
      id: new RandomNumber().create(),
      data: data,
      image: imageBuffer,
      remoteImagePath: this.state.endpoints.montereyRegistry + imagePath
    };
  }
}
