'use strict';
const {ipcMain} = require('electron');
const fs = require('fs');
const path = require('path');

module.exports = class Logger {

  constructor(timer) {
    this.logBuffer = '';
    this.timeout = timer || 10000;
    this.logFolder = path.join(__dirname, 'logs');
    this.logFileName = this.getLogFileName();
    this.logFilePath = path.join(this.logFolder, this.logFileName);
    this.verifyLogPathAndFile();
  }

  getLogFileName() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth().toString().length === 1 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let day = date.getDate().toString().length === 1 ? '0' + date.getDate() : date.getDate();
    return `${year}-${month}-${day}.csv`;
  }

  // make sure that the folder and logfile exists
  // if not, create them
  verifyLogPathAndFile() {
    this.checkFileOrFolderAccess(this.logFolder)
      .then((err) => {
        if (err) {
          //path does not exist
          this.makeDir(this.logFolder)
            .then((err) => {
              if (!err) {
                //folder created, lets create/append headers to file
                this.appendToFile(this.logFilePath, 'type;id;date;msg').then((err) => {
                  if (err) {
                    console.log(err)
                  }
                });
              }
            })
        } else {
          this.checkFileOrFolderAccess(this.logFilePath)
            .then((err) => {
              if (err) {
                //file does not exist, lets create/append headers
                this.appendToFile(this.logFilePath, 'type;id;date;msg').then((err) => {
                  if (err) {
                    console.log(err)
                  }
                });
              } else {
                this.appendToFile(this.logFilePath, 'info;monetery;date;application started').then((err) => {
                  if (err) {
                    console.log(err)
                  }
                });
              }
            })
        }
      });
  }

  checkFileOrFolderAccess(fileOrPath) {
    return new Promise((resolve, reject) => {
      try {
        fs.access(fileOrPath, fs.R_OK && fs.W_OK, (err) => {
          resolve(err)
        });
      } catch (e) {
        console.log('failed to get access of directory');
        // resolve anyway
        resolve();
      }
    });
  };

  makeDir(folderPath) {
    return new Promise((resolve, reject) => {
      try {
        fs.mkdir(folderPath, (err, folder) => {
          resolve(err)
        });
      } catch (e) {
        console.log('failed to create directory for logs');
        // resolve anyway
        resolve();
      }
    });
  };

  appendToFile(file, text) {
    return new Promise((resolve, reject) => {
      try {
        fs.appendFile(file, text + '\n', (err) => {
          resolve(err)
        });
      } catch (e) {
        console.log('appendToFile failed in logger');
        // resolve anyway
        resolve();
      }
    });
  }

  addFlushDelay() {
    this.timer = setTimeout(() => this.flushBuffer(), this.timeout);
  }

  flushBuffer() {
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
        console.log('failed to flush log buffer');
      }
    } else {
      this.addFlushDelay();
    }
    this.logBuffer = '';
  }

  activate() {
    this.addFlushDelay();

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

      // convert to csv line format
      let result = `${type};${id};${new Date().toISOString()};${msg}\r\n`;

      this.logBuffer = this.logBuffer + result;
    });
  }
};

