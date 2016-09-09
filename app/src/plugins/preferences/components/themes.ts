import {autoinject, bindable} from 'aurelia-framework';
import {ThemeManager}         from '../../../shared/theme-manager';

@autoinject()
export class Themes {
  @bindable selectedTheme = 'default';

  constructor(private themeManager: ThemeManager) {}

  selectedThemeChanged(newVal, oldVal) {  
    if (newVal) {
      this.themeManager.load(this.selectedTheme);
    }
  }

  save() {}
}