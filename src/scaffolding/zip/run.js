import {inject}    from 'aurelia-framework';
import {Fs}        from '../../shared/abstractions/fs';
import {GithubAPI} from '../../shared/github-api';

@inject(Fs, GithubAPI)
export class Run {
  failed = false;
  finished = false;
  logs = [];

  constructor(fs, githubAPI) {
    this.fs = fs;
    this.githubAPI = githubAPI;
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
        let url;
        let subDir;
        let projectDir = this.fs.join(this.state.path, this.state.name);

        if (this.state.source === 'skeleton') {
          let releaseInfo = await this.githubAPI.getLatestRelease('aurelia', 'skeleton-navigation');
          url = releaseInfo.zipball_url;
          subDir = this.state.skeleton;
          this.logs.push(`Downloading version ${releaseInfo.tag_name}`);
        } else {
          url = this.state.zipUrl;
          subDir = this.state.zipSubfolder;
        }

        await this.downloadAndExtractZIP(url, projectDir, subDir);

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

  async downloadAndExtractZIP(url, projectDir, subDir) {
    let zipPath = await this.fs.getTempFile();
    this.logs.push(`Temp file created: ${zipPath}....`);
    await this.fs.downloadFile(url, zipPath);
    this.logs.push('Downloaded zip....');


    let unzipPath = await this.fs.getTempFolder();
    this.logs.push(`Temp folder created: ${unzipPath}....`);

    await this.fs.unzip(zipPath, unzipPath);
    this.logs.push('Unzipped files....');

    // unfortunately, github wraps the repository files in a folder in the zip
    // so we get the first directory name and extract that automatically
    let firstDir = (await this.fs.getDirectories(unzipPath))[0];

    await this.fs.move(`${unzipPath}/${firstDir}/${subDir}`, projectDir);
    this.logs.push(`Moved directory to ${projectDir}....`);

    try {
      this.fs.cleanupTemp();
      this.logs.push('Cleaned up temp files and folders');
    } catch (e) {
      console.log('Did not finish cleanup of temp folder: ', e);
    }
  }

  async execute() {
    return {
      goToNextStep: this.finished
    };
  }
}
