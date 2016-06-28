const remote = require('electron').remote;

export class Session {

  url = 'http://aureliatools.com';

  constructor() {
    this.mainWindow = remote.getGlobal('mainWindow');
    this.session = this.mainWindow.webContents.session;
  }

  get(key) {
    return new Promise((resolve, reject) => {
      return this.session.cookies.get({ name: key, url: this.url }, (error, cookies) => {
        if (error) reject(error);

        if (cookies.length > 0) {
          resolve(cookies[0].value);
        } else {
          resolve(undefined);
        }
      });
    });
  }

  async set(key, value) {
    return new Promise((resolve, reject) => {
      return this.session.cookies.set({ name: key, value: value, url: this.url }, (error) => {
        if (error) reject(error);
        resolve();
      });
    });
  }

  async clear() {
    return new Promise(resolve => {
      this.session.clearCache(() => resolve());
    });
  }
}
