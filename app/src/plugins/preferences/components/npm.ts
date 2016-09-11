import {autoinject}      from 'aurelia-framework';
import {NPM as NPMPal}   from 'monterey-pal';
import {Notification}    from '../../../shared/notification';

@autoinject()
export class NPM {
  npmRegistry: string;
  _npmRegistry: string;
  npmStrictSSL: boolean;
  _npmStrictSSL: boolean;

  loading: boolean;

  constructor(private notification: Notification) {}

  async attached() {
    this.loading = true;

    await this.load();

    this.loading = false;
  }

  async load() {
    this.npmStrictSSL = (await NPMPal.getConfig('strict-ssl')).trim() === 'true';
    this._npmStrictSSL = this.npmStrictSSL;

    this.npmRegistry = (await NPMPal.getConfig('registry')).trim();
    this._npmRegistry = this.npmRegistry;
  }

  async save() {
    this.loading = true;

    if (this._npmRegistry !== this.npmRegistry) {
      await NPMPal.setConfig('registry', `${this.npmRegistry}`);
    }

    if (this._npmStrictSSL !== this.npmStrictSSL) {
      await NPMPal.setConfig('strict-ssl', `${this.npmStrictSSL}`);
    }

    await this.load();

    this.loading = false;

    this.notification.success('Changes saved');
  }
}