'use strict';
const {ipcMain} = require('electron');
const fs = require('fs');
const path = require('path');

module.exports = class Logger {

  constructor(logFolder, app, timer, days) {
    console.log("Starting Monterey logger");
    this.logBuffer = '';
    this.timeout = timer || 10000;
    this.deleteAfterDays = days || 5;

    this.logFolder = logFolder;
    this.logFileName = this.getLogFileName();
    this.logFilePath = path.join(this.logFolder, this.logFileName);

    this.verifyLogPathAndFile()
    .then(() => {
      return this.clearLog(this.deleteAfterDays);
    });
  }

  getLogFileName() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth().toString().length === 1 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let day = date.getDate().toString().length === 1 ? '0' + date.getDate() : date.getDate();
    return `${year}-${month}-${day}.csv`;
  }

  // make sure that the logfile exists
  // if not, create it
  verifyLogPathAndFile() {
    return this.fileOrFolderExists(this.logFolder)
    .then(exists => {
      if (!exists) {
        return this.makeDir(this.logFolder)
      }
    })
    .then(() => {
      return this.fileOrFolderExists(this.logFilePath)
      .then(exists => {
        if (!exists) {
          // logfile did not exist, add csv headers to the file
          // this also creates the file
          return this.appendToFile(this.logFilePath, 'type;id;date;msg').then((err) => {
            if (err) {
              console.log(err)
            }
          });
        }
      });
    })
    .catch((e)=> {
      console.log('Error during verifyLogPathAndFile');
      console.log(e);
    });
  }

  // cleanup old log files
  clearLog(days) {
    return new Promise((resolve, reject) => {
      try {
        // get the date of 5 days ago
        let tempDate = new Date();
        tempDate.setDate(tempDate.getDate() - days);
        var deleteDate = tempDate.getTime();

        // read out files in log folder
        this.getFilesInDir(path.normalize(this.logFolder))
        .then(files => {
          if (files) {
            let promises = [];
            // iterate over the files
            files.forEach(file => {
              let filePath = path.join(this.logFolder, file);

              promises.push(this.getModifiedDate(filePath)
              .then(modifiedDate => {
                // should we cleanup this file?
                if (deleteDate > modifiedDate) {
                  // yes we do, logfile is too old
                  // delete the file
                  return this.deleteFile(filePath);
                }
              }));
            });

            return Promise.all(promises);
          }
          resolve();
        });          
      } catch (e) {
        //here we want it to continue...
        console.log('error during clearLog()');
        console.log(e);
        resolve();
      }
    });
  }


  fileOrFolderExists(fileOrPath) {
    return new Promise((resolve, reject) => {
      try {
        fs.access(fileOrPath, fs.R_OK && fs.W_OK, (err) => {
          if(err) resolve(false);
          resolve(true);
        });
      } catch (e) {
        console.log(e);
        reject('error during fileOrFolderExists() with params:' + folderPath);
      }
    });
  }

  getFilesInDir(path) {
    return new Promise((resolve, reject) => {
      fs.readdir(path, (err, files)=> {
        if (err) {
          reject(err);
        }
        resolve(files);
      });
    });
  }

  deleteFile(path) {
    return new Promise((resolve, reject) => {
      fs.unlink(path, err => {
        if (err) {
          console.log(`failed to remove old logfile ${path}: ${err}`);
          reject(err);
        } else {
          console.log(`removed old logfile: ${path}`)
          resolve();
        }
      });
    });
  }

  getModifiedDate(filePath) {
    return new Promise((resolve, reject) => {
      fs.stat(filePath, (err, fileStat) => {
        if (err) {
          reject(err);
          return;
        }
        let lastModifiedDate = new Date(fileStat.mtime).getTime();
        resolve(lastModifiedDate);
      });
    });
  }

  makeDir(folderPath) {
    return new Promise((resolve, reject) => {
      try {
        fs.mkdir(folderPath, (err, folder) => {
          if(err) reject(err);
          resolve();
        });
      } catch (e) {
        console.log(e);
        reject('error during makeDir() with params:' + folderPath);
      }
    });
  }

  appendToFile(file, text) {
    return new Promise((resolve, reject) => {
      try {
        fs.appendFile(file, text + '\n', (err) => {
          resolve(err)
        });
      } catch (e) {
        console.log(e);
        // resolve anyway
        reject('error during appendToFile() with params:' + file);
      }
    });
  }
 
  addFlushDelay() {
    this.timer = setTimeout(() => this.flushBuffer(), this.timeout);
  }

  flushBuffer() {
    // don't write to disk if the buffer is empty
    if (this.logBuffer !== '') {
      try {
        this.appendToFile(this.logFilePath, this.logBuffer).then((err) => {
          if (err) {
            console.log(err)
          }
          this.addFlushDelay();
        });
      } catch (e) {
        // we couldn't flush the buffer but we should swallow the exception
        console.log('error during flushBuffer() crashed');
        console.log(e);
      }
    } else {
      this.addFlushDelay();
    }
    this.logBuffer = '';
  }

  writeToBuffer(type, id, msg) {
  // convert to csv line format
    let result = `${type};${id};${new Date().toISOString()};${msg}\r\n`;

    // append to buffer
    this.logBuffer = this.logBuffer + result;
  }

  activate() {
    this.addFlushDelay();

    this.writeToBuffer('info', 'monterey', 'application started');

    //event listener for logging
    ipcMain.on('log-message', (event, args) => {
      let type = args.type;

      let id = args.id;
      let msg = '';

      //parse the message to string
      if (args.msg.length !== undefined) {
        args.msg.forEach((e) => {
          if (typeof (e) === 'object') {
            e = JSON.stringify(e);
          }
          msg = msg + e;
        })
      }

      this.writeToBuffer(type, id, msg);
    });
  }
};