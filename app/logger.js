'use strict';
const {ipcMain} = require('electron');
const fs = require('fs');
const path = require('path');

module.exports = class Logger {

  constructor(timer, days) {
    console.log("Stating Monetery-logger");
    this.logBuffer = '';
    this.timeout = timer || 10000;
    this.deleteAfterDays = days || 5;
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
    console.log("Checking log folder");
    this.checkFileOrFolderAccess(this.logFolder)
      .then(()=> {
        console.log("Clearing old files");
        //important this runs after checkFileOrFolderAccess()
        this.clearLog(this.deleteAfterDays);
      })
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
      })
      .catch((e)=> {
        console.log(e);
      });
  }

  //important this runs after checkFileOrFolderAccess()
  clearLog(days) {
    return new Promise((resolve, reject) => {
      try {
        //get temp date and set it back 5 days into deleteDate variable
        let tempDate = new Date();
        tempDate.setDate(tempDate.getDate() - days);
        var deleteDate = tempDate.getTime();

        //read out files in log folder
        fs.readdir(path.join(this.logFolder, ''), (err, files)=> {
          if (err) {
            console.log(err);
          }

          //loop the files
          files.forEach((file)=> {

            //get the stat of the file
            fs.stat(path.join(this.logFolder, file), (err, fileStat) => {
              if (err) {
                console.log(err);
              }
              //get date modified
              let filedate = new Date(fileStat.mtime).getTime();

              //is date lover then 5 days
              if (deleteDate > filedate) {

                //delete the file
                fs.unlink(path.join(this.logFolder, file), (err)=> {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log('logfile deleted :' + file);
                  }
                })
              }
            });
          });
          resolve();
        })
      } catch (e) {
        //here we want it to continue...
        console.log('function : checkFileOrFolderAccess() crashed');
        console.log(e);
        resolve();
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
        console.log(e);
        // resolve anyway
        reject('function : checkFileOrFolderAccess() crashed with params:' + folderPath);
      }
    });
  }

  makeDir(folderPath) {
    return new Promise((resolve, reject) => {
      try {
        fs.mkdir(folderPath, (err, folder) => {
          resolve(err)
        });
      } catch (e) {
        console.log(e);
        // resolve anyway
        reject('function : makeDir() crashed with params:' + folderPath);
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
        reject('function : appendToFile() crashed with params:' + file);
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
        console.log('function : flushBuffer() crashed');
        console.log(e);
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

