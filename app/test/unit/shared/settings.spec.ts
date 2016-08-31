import {Settings}  from '../../../src/shared/settings';
import {ApplicationState}  from '../../../src/shared/application-state';
import {Container} from 'aurelia-framework';

describe('IPC', () => {
  let sut: Settings;
  let container: Container;
  let state: ApplicationState;

  beforeEach(() => {
    container = new Container();
    state = container.get(ApplicationState);
    sut = container.get(Settings);
  });

  it('only adds settings that are not in the applicationstate already', () => {
    expect(state.settings.length).toBe(0);
    sut.addSetting({
      identifier: 'some-setting',
      value: true,
      type: 'boolean',
      title: 'some setting'
    });
    expect(state.settings.length).toBe(1);

    // add it again
    sut.addSetting({
      identifier: 'some-setting',
      value: true,
      type: 'boolean',
      title: 'some setting'
    });
    expect(state.settings.length).toBe(1);
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

  it('save calls save on the state', async (d) => {
    let saveSpy = spyOn(state, '_save');
    await sut.save();
    expect(saveSpy).toHaveBeenCalled();
    d();
  });
});