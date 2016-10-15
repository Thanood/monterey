import {GithubAPI} from '../../../src/shared/github-api';

export class GithubAPIFake {
  githubAPIUrl = 'https://api.github.com';
  client: any;
  _authConfigured = false;

  getLatestReleaseZIP = jasmine.createSpy('getLatestReleaseZIP').and.returnValue(Promise.resolve());
  execute = jasmine.createSpy('execute').and.returnValue(Promise.resolve());

  getTags = jasmine.createSpy('getTags').and.returnValue(Promise.resolve());
  getLatestRelease = jasmine.createSpy('getLatestRelease').and.returnValue(Promise.resolve());
  getReleases = jasmine.createSpy('getReleases').and.returnValue(Promise.resolve());
  getLatestTag = jasmine.createSpy('getLatestTag').and.returnValue(Promise.resolve());
  getContents = jasmine.createSpy('getContents').and.returnValue(Promise.resolve());
  confirmAuth = jasmine.createSpy('confirmAuth').and.returnValue(Promise.resolve());
  setCreds = jasmine.createSpy('setCreds').and.returnValue(Promise.resolve());
}

export * from '../../../src/shared/github-api';