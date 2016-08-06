'use strict';
const {ipcMain} = require('electron');
const fs = require('fs');

module.exports = class Logger {


  constructor() {
    this.logFileString = this.generatelogFileStringString();
    this.logFolderString = 'logs';
    this.logFolder = this.addToPath(__dirname, this.logFolderString);
    this.logFileWithPath = this.addToPath(this.logFolder, this.logFileString);
    this.verifyLogPathAndFile();
  }


  addToPath(arg1, arg2) {
    return `${arg1}${process.platform === 'win32' ? `\\${arg2}` : `//${arg2}`}`;
  };


  generatelogFileStringString() {
    let date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.txt`;
  }


  verifyLogPathAndFile() {

    this.checkFileOrFolderAccess(this.logFolder)
      .then((err)=> {
        if (err) {
          //path does not exist
          this.makeDir(this.logFolder)
            .then((err)=> {
              if (!err) {
                //folder created, lets create/append headers to file
                this.appendToFile(this.logFileWithPath, 'type;id;date;msg').then((err)=> {
                  if (err) {
                    console.log(err)
                  }
                });
              }
            })
        } else {
          this.checkFileOrFolderAccess(this.logFileWithPath)
            .then((err)=> {
              if (err) {
                //file does not exist, lets create/append headers
                this.appendToFile(this.logFileWithPath, 'type;id;date;msg').then((err)=> {
                  if (err) {
                    console.log(err)
                  }
                });
              } else {
                this.appendToFile(this.logFileWithPath, 'info;monetery;date;application started').then((err)=> {
                  if (err) {
                    console.log(err)
                  }
                });
              }
            })
        }
      });
  }


  currentlogFileString() {
    return this.logFileWithPath;
  }


  checkFileOrFolderAccess(fileOrPath) {
    return new Promise((resolve, reject) => {
      fs.access(fileOrPath, fs.R_OK && fs.W_OK, (err) => {
        resolve(err)
      });
    });
  };


  makeDir(folderPath) {
    return new Promise((resolve, reject) => {
      fs.mkdir(folderPath, (err, folder) => {
        resolve(err)
      });
    });
  };


  appendToFile(file, text) {
    return new Promise((resolve, reject) => {
      fs.appendFile(file, text + '\n', (err) => {
        resolve(err)
      });
    });
  }


  activate() {
    //event listener for logging
    ipcMain.on('log-message', (event, args) => {

      let type = args.type;
      let id = args.id;
      let msg = "";

      //parse the message to string
      if (args.msg.length !== undefined) {
        args.msg.forEach((e)=> {
          if (typeof(e) === 'object') {
            e = JSON.stringify(e);
          }
          msg = msg + e;
        })
      }

      //split up so we can use it in open office
      let result = `${type};${id};${new Date().toISOString()};${msg}`;

      // no timeout for this atm, cant have this before we find a better way to know if electron failed
      this.appendToFile(this.logFileWithPath, result).then((err)=> {
        if (err) {
          console.log(err)
        }
      });
    });
  }


}

