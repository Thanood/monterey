export class SettingsFake {
  getValue = jasmine.createSpy('getValue');
}

export {Settings} from '../../../src/shared/settings';