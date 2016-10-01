import {MontereyRegistries} from '../../../src/shared/monterey-registries';

export class MontereyRegistriesFake implements MontereyRegistries {
  state;
  client: any;
  cache = {
    templates: null,
    gistrun: null,
    gitbooks: null,
    appLaunchers: null
  };
  getClient = jasmine.createSpy('getClient');
  getTemplates = jasmine.createSpy('getTemplates').and.returnValue(Promise.resolve([]));
  getGistRun = jasmine.createSpy('getGistRun').and.returnValue(Promise.resolve([]));
  getGitbooks = jasmine.createSpy('getGitbooks').and.returnValue(Promise.resolve([]));
  getAppLaunchers = jasmine.createSpy('getAppLaunchers').and.returnValue(Promise.resolve([]));
  getAppLauncherData = jasmine.createSpy('getAppLauncherData').and.returnValue(Promise.resolve([]));
}

export * from '../../../src/shared/monterey-registries';