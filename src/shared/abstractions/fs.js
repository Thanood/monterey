const fs       = require('fs');
const dialog   = require('electron').remote.dialog;
const path     = require('path');

export class Fs {
  async readFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', function(err, data) {
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

  join(firstSegment, secondSegment) {
    return path.join(firstSegment, secondSegment);
  }
}
