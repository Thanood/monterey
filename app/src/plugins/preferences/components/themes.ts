import {autoinject, bindable} from 'aurelia-framework';
import {Settings, ThemeManager, Notification} from '../../../shared/index';

@autoinject()
export class Themes {
  @bindable selectedTheme;

  constructor(private themeManager: ThemeManager,
              private notification: Notification,
              private settings: Settings) {
    this.selectedTheme = settings.getValue('theme');
  }

  selectedThemeChanged(newVal, oldVal) {
    if (newVal) {
      this.themeManager.load(this.selectedTheme);
    }
  }

  async save() {
    await this.settings.setValue('theme', this.selectedTheme);
    await this.settings.save();

    this.notification.success('Changes saved');
  }
}