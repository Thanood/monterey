import {Settings} from '../../shared/settings';

/**
 * Settings that cannot be initialized from a plugin
 */
export class OtherSettings {
  add(settings: Settings) {
    settings.addSetting({
      identifier: 'check-for-updates',
      title: 'Check for updates?',
      type: 'boolean',
      value: true
    });

    settings.addSetting({
      identifier: 'theme',
      title: 'Theme',
      type: 'string',
      visible: false,
      value: 'default'
    });

    settings.addSetting({
      identifier: 'language',
      title: 'Language',
      type: 'string',
      value: 'en',
      options: [
        { value: 'en', display: 'English' }
      ]
    });
  }
}