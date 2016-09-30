import {ApplicationState} from '../../../src/shared/application-state';

export class ApplicationStateFake implements ApplicationState {
  gitAuthorization = 'not:set';
  projects = [];
  appLaunchers = [];
  settingValues = [];
  selectedProjectPath;
  endpoints = {
    montereyRegistry: 'https://monterey-framework.github.io/registries/',
    npmRegistry: 'https://registry.npmjs.org/',
    githubApi: 'https://api.github.com/',
    github: 'https://github.com/'
  };
  __meta__: any = {};

  _loadStateFromSession = jasmine.createSpy('_loadStateFromSession').and.returnValue(Promise.resolve());
  _isNew = jasmine.createSpy('_isNew').and.returnValue(Promise.resolve(false));
  _save = jasmine.createSpy('_save').and.returnValue(Promise.resolve());
  _getStateIdentifier = jasmine.createSpy('_getStateIdentifier').and.returnValue('cmydir');
  _normalize = jasmine.createSpy('_normalize').and.callThrough();
}

export * from '../../../src/shared/application-state';