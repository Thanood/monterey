const fs       = require('fs');
const dialog   = require('electron').remote.dialog;

export class Fs {
  async readFile(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', function(err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  async showOpenDialog(config) {
    return new Promise(resolve => {
      dialog.showOpenDialog(config, c => resolve(c));
    });
  }
}
