const fs = require('fs');

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
}
