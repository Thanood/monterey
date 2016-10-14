import {Updater} from '../../../src/updater/updater';
import {GithubAPI} from '../../../src/shared/github-api';
import {Container} from 'aurelia-dependency-injection';
import {SESSION} from 'monterey-pal';
import '../setup';

describe('Updater', () => {
  let sut: Updater;
  let container: Container;

  beforeEach(() => {
    container = new Container();
    // container.registerInstance(GithubAPI, {
    //   getLatestRelease: jasmine.createSpy()
    // });
    sut = container.get(Updater);
    SESSION.getEnv = () => 'production';
  });

  it('does not update when in development', async (r) => {
    SESSION.getEnv = () => 'development';
    expect(await sut.needUpdate()).toBe(false);
    r();
  });
});