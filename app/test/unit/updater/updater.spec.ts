import {Updater}    from '../../../src/updater/updater';
import {GithubAPI, GithubAPIFake, DialogService, DialogServiceFake, Settings, SettingsFake} from '../fakes/index';
import {Container}  from 'aurelia-dependency-injection';
import {SESSION}    from 'monterey-pal';
import '../setup';

describe('Updater', () => {
  let sut: Updater;
  let container: Container;

  beforeEach(() => {
    container = new Container();
    container.registerSingleton(GithubAPI, GithubAPIFake);
    container.registerSingleton(DialogService, DialogServiceFake);
    container.registerSingleton(Settings, SettingsFake);

    let settings = container.get(Settings);
    settings.getValue = (key) => {
      if (key === 'check-for-updates') return true;
    };

    sut = container.get(Updater);
    SESSION.getEnv = () => 'production';
  });

  it('does not open update modal when update is not necessary', async (r) => {
    let dialogService = container.get(DialogService);

    spyOn(sut, 'needUpdate').and.returnValue(Promise.resolve(false));

    await sut.checkForUpdate();

    expect(dialogService.open).not.toHaveBeenCalled();
    r();
  });

  it('opens update modal when update is available', async (r) => {
    let dialogService = container.get(DialogService);

    spyOn(sut, 'needUpdate').and.returnValue(Promise.resolve(true));

    await sut.checkForUpdate();

    expect(dialogService.open).toHaveBeenCalled();
    r();
  });

  it('does not update when update dialog gets cancelled', async (r) => {
    let dialogService = container.get(DialogService);
    dialogService.open.and.returnValue(Promise.resolve({ wasCancelled: true }));

    spyOn(sut, 'needUpdate').and.returnValue(Promise.resolve(true));
    spyOn(sut, 'update').and.returnValue(Promise.resolve());

    await sut.checkForUpdate();

    expect(sut.update).not.toHaveBeenCalled();
    r();
  });

  it('updates when update modal has not been cancelled', async (r) => {
    let dialogService = container.get(DialogService);
    dialogService.open.and.returnValue(Promise.resolve({ wasCancelled: false }));

    spyOn(sut, 'needUpdate').and.returnValue(Promise.resolve(true));
    spyOn(sut, 'update').and.returnValue(Promise.resolve());

    await sut.checkForUpdate();

    expect(sut.update).toHaveBeenCalled();
    r();
  });

  it('does not update when in development', async (r) => {
    setupUpdate(container, sut);
    SESSION.getEnv = () => 'development';
    expect(await sut.needUpdate()).toBe(false);
    r();
  });

  it('needUpdate returns true when latest version is different than current version', async (r) => {
    setupUpdate(container, sut);
    expect(await sut.needUpdate()).toBe(true);
    r();
  });

  it('needUpdate returns false if githubapi cannot be reached', async (r) => {
    let api = container.get(GithubAPI);
    api.getLatestRelease.and.returnValue(Promise.reject({ status: 401 }));

    try {
      expect(await sut.needUpdate()).toBe(false);
    } catch (e) { r.fail(e); }
    r();
  });
});

function setupUpdate (container, sut) {
  let api = container.get(GithubAPI);
  api.getLatestRelease.and.returnValue(Promise.resolve({ name: 'v999.9' }));
  spyOn(sut, '_getCurrentVersion').and.returnValue(Promise.resolve('v1.0'));
}