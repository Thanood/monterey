const fs = require('fs');

export class Fs {
  async readFile(path) {
    return new Promise((resolve, reject) => {
      fs.readFile('node_modules/aurelia-cli/lib/commands/new/new-application.json', 'utf8', function(err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }
}
