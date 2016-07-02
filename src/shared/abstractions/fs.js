const fs       = require('fs');
const dialog   = require('electron').remote.dialog;
const path     = require('path');
const https    = require('https');
const temp     = require('temp').track();
const yauzl    = require('yauzl');
const mkdirp   = require('mkdirp');
const mv       = require('mv');
const nodeUrl  = require('url');

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

  async getTempFile() {
    return new Promise((resolve, reject) => {
      temp.open('monterey', function(err, info) {
        if (err) {
          reject(err);
          return;
        }

        resolve(info.path);
      });
    });
  }

  async getTempFolder() {
    return new Promise((resolve, reject) => {
      temp.mkdir('monterey', function(err, dirPath) {
        if (err) {
          reject(err);
          return;
        }

        resolve(dirPath);
      });
    });
  }

  async move(from, to) {
    return new Promise((resolve, reject) => {
      mv(from, to, {mkdirp: true}, function(err) {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }

  async unzip(zipPath, outPath) {
    return new Promise(resolve => {
      yauzl.open(zipPath, {autoClose: true, lazyEntries: true}, (err, zipfile) => {
        if (err) throw err;
        zipfile.readEntry();
        zipfile.on('close', () => resolve());
        zipfile.on('error', () => reject());
        zipfile.on('entry', (entry) => {
          if (/\/$/.test(entry.fileName)) {
            // directory file names end with '/'
            mkdirp(this.join(outPath, entry.fileName), (err1) => {
              if (err1) throw err1;
              zipfile.readEntry();
            });
          } else {
            // file entry
            zipfile.openReadStream(entry, (err2, readStream) => {
              if (err2) throw err2;
              // ensure parent directory exists
              mkdirp(path.dirname(this.join(outPath, entry.fileName)), (err3) => {
                if (err3) throw err3;
                readStream.pipe(fs.createWriteStream(this.join(outPath, entry.fileName)));
                readStream.on('end', function() {
                  zipfile.readEntry();
                });
              });
            });
          }
        });
      });
    });
  }

  async getDirectories(p) {
    return new Promise((resolve, reject) => {
      fs.readdir(p, function(err, files) {
        if (err) {
          reject(err);
          return;
        }

        resolve(files.filter(function(file) {
          return fs.statSync(path.join(p, file)).isDirectory();
        }));
      });
    });
  }

  cleanupTemp() {
    temp.cleanupSync();
  }

  downloadFile(url, targetPath) {
    return new Promise(async (resolve, reject) => {
      let file = fs.createWriteStream(targetPath);
      try {
        await this._downloadFile(file, url, targetPath);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  _downloadFile(stream, url, targetPath) {
    let promise = new Promise((resolve, reject) => {
      let opts = nodeUrl.parse(url);
      opts.headers = {
        'User-Agent': 'electron'
      };
      https.get(opts, (response) => {
        if (response.statusCode === 200) {
          response.on('data', function(data) {
            stream.write(data);
          }).on('end', function() {
            stream.end();
            resolve();
          });
        } else if (response.statusCode === 302 && response.headers.location) {
          // in case of redirect, try again with the redirected location
          this._downloadFile(stream, response.headers.location, targetPath)
          .then(() => resolve())
          .catch(e => reject(e));
        } else {
          reject(`ERROR: Status code ${response.statusCode} is not 200 or 302 (redirect)`);
        }
      });
    });

    return promise;
  }
}
