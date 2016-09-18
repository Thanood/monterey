import {DOM} from 'aurelia-pal';

/**
 * Loads and unloads themes
 */
export class ThemeManager {
  load(theme: string) {
    let themePath = this.getNormalizedThemePath(theme);
    this.removeOldThemes();
    this.deleteFromSystemJS(themePath);

    return System.import(themePath);
  }

  removeOldThemes() {
    jQuery('head > link').each(function() {
      if (this.href.includes('styles/monterey.')) {
        DOM.removeNode(this);
      }
    });
  }

  getNormalizedThemePath(theme) {
    return System.normalizeSync(`./styles/monterey.${theme}.css!`);
  }

  deleteFromSystemJS(normalizedPath) {
    if (System.has(normalizedPath)) {
      System.delete(normalizedPath);
    }
  }
}