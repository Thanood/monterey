import {Updater}    from '../../../src/updater/updater';
import {GithubAPI, GithubAPIFake, DialogService, DialogServiceFake, Settings, logger, SettingsFake, Messages, MessagesFake, Notification, NotificationFake} from '../fakes/index';
import {Container}  from 'aurelia-dependency-injection';
import {SESSION}    from 'monterey-pal';
import {LogManager} from 'aurelia-framework';
import '../setup';

describe('Updater', () => {
  let sut: Updater;
  let container: Container;

  beforeEach(() => {
    container = new Container();
    container.registerSingleton(GithubAPI, GithubAPIFake);
    container.registerSingleton(DialogService, DialogServiceFake);
    container.registerSingleton(Settings, SettingsFake);
    container.registerSingleton(Messages, MessagesFake);
    container.registerSingleton(Notification, NotificationFake);

    let settings = container.get(Settings);
    settings.getValue = (key) => {
      if (key === 'check-for-updates') return true;
    };

    sut = container.get(Updater);
    SESSION.getEnv = () => 'production';
  });

  it('adds notification when update is available', async (r) => {
    let messages = container.get(Messages);
    setupUpdate(container, sut);
    await sut.checkForUpdate();
    expect(logger.info).toHaveBeenCalledWith(jasmine.anything(), 'Update available, showing notification');
    expect(messages.add).toHaveBeenCalled();
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