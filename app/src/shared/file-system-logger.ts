import {FS, ELECTRON} from 'monterey-pal';

export class FileSystemLogger {

  buffer: string = '';
  timeout: number;
  deleteAfterDays: number;
  logFileName: string;
  logFilePath: string;

  constructor(public logFolder?: string, 
              public timer: number = 10000, 
              public days: number = 5) {
    if (!this.logFolder) {
      this.logFolder = FS.join(ELECTRON.getPath('userData'), 'logs');
    }
    this.logFileName = this.getLogFileName();
    this.logFilePath = FS.join(this.logFolder, this.logFileName);
  }

  getLogFileName(date = new Date()) {
    let year = date.getFullYear();
    let month = date.getMonth().toString().length === 1 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let day = date.getDate().toString().length === 1 ? '0' + date.getDate() : date.getDate();
    return `${year}-${month}-${day}.csv`;
  }

  // make sure that the logfile exists
  // if not, create it
  async verifyLogPathAndFile() {
    let exists = await this.fileOrFolderExists(this.logFolder);

    if (!exists) {
      await FS.mkdir(this.logFolder);
    }

    exists = await this.fileOrFolderExists(this.logFilePath);

    if (!exists) {
      // logfile did not exist, add csv headers to the file
      // this also creates the file
      try {
        await this.appendToFile(this.logFilePath, 'type,id,date,msg');
      } catch(err) {
        if (err) {
          console.log(err)
        }
      }
    }
  }

  // cleanup old log files
  async clearLog(days) {
    // get the date of 5 days ago
    let tempDate = new Date();
    tempDate.setDate(tempDate.getDate() - days);
    var deleteDate = tempDate;

    // read out files in log folder
    let files = await FS.readdir(this.logFolder);
    if (files) {
      // iterate over the files
      for(let x = 0; x < files.length; x++) {
        let filePath = FS.join(this.logFolder, files[x]);

        try {
          let modifiedDate = await this.getModifiedDate(filePath);
          // should we cleanup this file?
          if (deleteDate.getTime() > modifiedDate.getTime()) {
            // yes we do, logfile is too old
            // delete the file
            await FS.unlink(filePath);
          }
        } catch (e) {
          console.log(`could not get modified date of ${filePath}`);
          console.log(e);
        }
      }
    }
  }


  async fileOrFolderExists(fileOrPath: string) {
    return await FS.access(fileOrPath, FS.getConstants().R_OK && FS.getConstants().W_OK);
  }

  async getModifiedDate(filePath: string) {
    let stat = await FS.stat(filePath);
    return new Date(stat.mtime);
  }

  async appendToFile(file, text) {
    try {
      let err = await FS.appendFile(file, text);
      return err;
    } catch (e) {
      console.log(`could not append to file: "${file}"`)
      console.log(e);
    }
  }
 
  addFlushDelay() {
    this.timer = setTimeout(() => this.flushBuffer(), this.timeout);
  }

  async flushBuffer() {
    // don't write to disk if the buffer is empty
    if (this.buffer === '') {
      this.addFlushDelay();
      return;
    }

    try {
      let err = await this.appendToFile(this.logFilePath, this.buffer);
      if (err) {
        console.log('could not flush buffer');
        console.log(err);
      } else {
        this.buffer = '';
      }
    } catch (e) {
      // we couldn't flush the buffer but we should swallow the exception
      console.log('could not flush buffer');
      console.log(e);
    }

    this.addFlushDelay();
  }

  writeToBuffer(type: string, id: string, msg: string) {
    msg = msg.replace(/\r?\n|\r/g, '');

    // convert to csv line format
    let result = `"${type}","${id}","${new Date().toISOString()}","${msg}"\r\n`;

    // append to buffer
    this.buffer = this.buffer + result;
  }

  async activate() {
    await this.verifyLogPathAndFile();

    try {
      await this.clearLog(this.deleteAfterDays);
    } catch(e) {
      console.log('error while trying to clear log');
      console.log(e);
    }

    this.addFlushDelay();

    this.writeToBuffer('info', 'monterey', 'application started');
  }
};