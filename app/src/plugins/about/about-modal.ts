import {FS, OS, DialogController, autoinject} from '../../shared/index';

@autoinject()
export class AboutModal {

  montereyVersion: string;
  nodeJSVersion: string;
  electronVersion: string;

  constructor(private dialogController: DialogController) {}

  async activate() {
    let packageJSON = JSON.parse(await FS.readFile(FS.join(FS.getRootDir(), 'package.json')));

    this.montereyVersion = packageJSON.version + '-Atom';
    this.nodeJSVersion = OS.getNodeVersion();
    this.electronVersion = OS.getElectronVersion();
  }
}