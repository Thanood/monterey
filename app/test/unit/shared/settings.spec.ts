import {Settings}  from '../../../src/shared/settings';
import {ApplicationState}  from '../../../src/shared/application-state';
import {Container} from 'aurelia-framework';

describe('Settings', () => {
  let sut: Settings;
  let container: Container;
  let state: ApplicationState;

  beforeEach(() => {
    container = new Container();
    state = container.get(ApplicationState);
    sut = container.get(Settings);
  });

  it('only adds settings that are not in the applicationstate already', () => {
    expect(sut.settings.length).toBe(0);
    sut.addSetting({
      identifier: 'some-setting',
      value: true,
      type: 'boolean',
      title: 'some setting'
    });
    expect(sut.settings.length).toBe(1);

    // add it again
    sut.addSetting({
      identifier: 'some-setting',
      value: true,
      type: 'boolean',
      title: 'some setting'
    });
    expect(sut.settings.length).toBe(1);
  });

  it('restores value from state', () => {
    state.settingValues = [{
      identifier: 'some-setting',
      value: true
    }];
    sut.addSetting({
      identifier: 'some-setting',
      value: false,
      type: 'boolean',
      title: 'some setting'
    });
    expect(sut.settings[0].value).toBe(true);
  });

  it('getSetting returns the correct setting or undefined', () => {
    expect(sut.getSetting('some-setting')).toBeUndefined();

    sut.addSetting({
      identifier: 'some-setting',
      value: true,
      type: 'boolean',
      title: 'some setting'
    });

    expect(sut.getSetting('some-setting').title).toBe('some setting');
  });

  it('getValue returns correct value', () => {
    sut.addSetting({
      identifier: 'some-setting',
      value: true,
      type: 'boolean',
      title: 'some setting'
    });

    expect(sut.getValue('some-setting')).toBe(true);
  });

  it('getValue defaults to null', () => {
    // some-setting does not exist
    expect(sut.getValue('some-setting')).toBe(null);
  });

  it('setValue updates the value of the setting', () => {
    sut.addSetting({
      identifier: 'some-setting',
      value: true,
      type: 'boolean',
      title: 'some setting'
    });

    sut.setValue('some-setting', false);

    expect(sut.getValue('some-setting')).toBe(false);
  });

  it('getSettings returns all settings', () => {
    for(let x = 0; x < 10; x++) {
      sut.addSetting({
        identifier: 'some-setting' + x,
        value: true,
        type: 'boolean',
        title: 'some setting'
      });
    }

    expect(sut.getSettings().length).toBe(10);
  });

  it('save function updates settingValues in applicationstate', async (d) => {
    let saveSpy = spyOn(state, '_save');
    state.settingValues = [];
    sut.settings = [{
      identifier: 'foo',
      value: 'foo'
    }, {
      identifier: 'bar',
      value: 'bar'
    }];
    await sut.save();
    expect(state.settingValues.length).toBe(2);
    expect(state.settingValues.find(x => x.identifier === 'foo').value).toBe('foo');
    expect(state.settingValues.find(x => x.identifier === 'bar').value).toBe('bar');
    d();
  });

  it('save calls save on the state', async (d) => {
    let saveSpy = spyOn(state, '_save');
    await sut.save();
    expect(saveSpy).toHaveBeenCalled();
    d();
  });
});