import {autoinject}         from 'aurelia-framework';
import {DialogController}   from 'aurelia-dialog';
import {FS, OS}             from 'monterey-pal';

@autoinject()
export class AboutModal {

  montereyVersion: string;
  nodeJSVersion: string;
  electronVersion: string;

  constructor(private dialogController: DialogController) {}

  async activate() {
    let packageJSON = JSON.parse(await FS.readFile(FS.join(FS.getRootDir(), 'package.json')));

    this.montereyVersion = packageJSON.version;
    this.nodeJSVersion = OS.getNodeVersion();
    this.electronVersion = OS.getElectronVersion();
  }
}