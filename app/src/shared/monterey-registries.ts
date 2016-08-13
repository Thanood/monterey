import 'fetch';
import {HttpClient} from 'aurelia-fetch-client';
import {ApplicationState} from './application-state';
import {BindingEngine, autoinject} from 'aurelia-framework';

@autoinject
export class MontereyRegistries {
  state;
  client: HttpClient;
  cache = {
    templates: null,
    gistrun: null,
    gitbooks: null,
    appLaunchers: null
  };

  constructor(state:ApplicationState, bindingEngine:BindingEngine) {
    this.state = state;
    this.client = new HttpClient();
    this.refreshConfiguration();
  }

  refreshConfiguration() {
    // TODO: Reconfigure - need to get this to fire after the saved app state is loaded from the users storage (local storage etc) 
    this.client.configure(config => config.withBaseUrl(this.state.endpoints.montereyRegistry));
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

  async getAppLaunchers() {
    if (this.cache.appLaunchers) {
      return this.cache.appLaunchers;
    }

    return this.client.fetch(`app-launchers.json`)
    .then(response => response.json())
    .then(data => { this.cache.appLaunchers = data; return data; });
  }

  async getAppLauncherData(platform, path) {
    let data = await this.client.fetch(`launchers/${platform}/${path}/launcher.json`)
    .then(response => response.json())
    .then(json => {
      return json;
    });

    // Get the icon as a blob
    let imagePath = `launchers/${platform}/${path}/${data.img}`;
    let imageBuffer;
    let image = await this.client.fetch(imagePath);
    let blob = await image.blob();

    // Read the blob into an array buffer as a data URL
    // Is there a less verbose way of doing this?
    var fileReader = new FileReader();
    let readerPromise = new Promise(function(resolve,reject){
      fileReader.onload = resolve;
    }).then((res:any) => {
      imageBuffer = res.target.result;
    });
    fileReader.readAsDataURL(blob);
    await readerPromise;

    return { data: data, image: imageBuffer, remoteImagePath: this.state.endpoints.montereyRegistry + imagePath };
  }
}