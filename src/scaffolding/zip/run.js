import {inject} from 'aurelia-framework';
import {Fs}     from '../../shared/abstractions/fs';

@inject(Fs)
export class Run {
  failed = false;
  finished = false;

  constructor(fs) {
    this.fs = fs;
  }

  async activate(model) {
    this.model = model;
    this.state = model.state;
    this.step = model.step;
    this.step.execute = () => this.execute();
  }

  attached() {
    this.promise = new Promise(async (resolve, reject) => {
      try {
        // need to get the latest release zip from github api
        let url = 'https://github.com/aurelia/skeleton-navigation/archive/1.0.0-beta.2.0.0.zip';
        let projectDir = this.fs.join(this.state.path, this.state.name);
        let subDir = this.state.skeleton;

        let zipPath = await this.fs.getTempFile();
        await this.fs.downloadFile(url, zipPath);


        let unzipPath = await this.fs.getTempFolder();

        await this.fs.unzip(zipPath, unzipPath);

        // unfortunately, github wraps the repository files in a folder in the zip
        // so we get the first directory name and extract that automatically
        let firstDir = (await this.fs.getDirectories(unzipPath))[0];

        await this.fs.move(`${unzipPath}/${firstDir}/${subDir}`, projectDir);

        try {
          this.fs.cleanupTemp();
        } catch (e) {
          console.log('Did not finish cleanup of temp folder: ', e);
        }

        this.finished = true;
        resolve();
      } catch (e) {
        alert('Error while scaffolding the application: ' + e.message);
        console.log(e);
        this.failed = true;
        reject();
      }
    });
  }

  async execute() {
    return {
      goToNextStep: this.finished
    };
  }
}
