import {autoinject, LogManager} from 'aurelia-framework';
import {FS}                     from 'monterey-pal';
import {GithubAPI}              from '../../shared/github-api';
import {IStep}                  from '../istep';
import {Notification}           from '../../shared/notification';


const logger = LogManager.getLogger('zip-scaffolder');

@autoinject()
export class Run {
  failed = false;
  failedMessage: string;
  finished = false;
  logs = [];
  step: IStep;
  model;
  state;
  promise: Promise<void>;

  constructor(private githubAPI: GithubAPI,
              private notification: Notification) {
  }

  async activate(model) {
    this.model = model;
    this.state = model.state;
    this.step = model.step;
    this.step.execute = () => this.execute();
    this.step.previous = () => this.previous();
  }

  async previous() {
    this.notification.warning('This is not possible at this point');
    return {
      goToPreviousStep: false
    };
  }

  attached() {
    this.promise = new Promise(async (resolve, reject) => {
      try {
        let url;
        let subDir;
        let projectDir = FS.join(this.state.path, this.state.name);

        if (this.state.source === 'skeleton') {
          let releaseInfo = await this.githubAPI.getLatestReleaseZIP(this.state.skeleton.repo);
          url = releaseInfo.zipball_url;
          subDir = this.state.skeleton.subfolder;
          this.logs.push(`Downloading version ${releaseInfo.tag_name}`);
        } else {
          url = this.state.zipUrl;
          subDir = this.state.zipSubfolder;
        }

        await this.downloadAndExtractZIP(url, projectDir, subDir);

        this.finished = true;
        this.state.successful = true;

        this.step.next();

        resolve();
      } catch (e) {
        this.notification.error('Error while scaffolding the application: ' + e.message);
        logger.error(e);
        this.failed = true;
        this.failedMessage = e.message;
        this.state.successful = false;
        reject();
      } finally {
        try {
          FS.cleanupTemp();
          this.logs.push('Cleaned up temp files and folders');
        } catch (e) {
          logger.info('Did not finish cleanup of temp folder: ', e);
        }
      }
    });
  }

  async downloadAndExtractZIP(url, projectDir, subDir) {
    let zipPath = await FS.getTempFile();
    this.logs.push(`Temp file created: ${zipPath}....`);
    await FS.downloadFile(url, zipPath);
    this.logs.push('Downloaded zip....');


    let unzipPath = await FS.getTempFolder();
    this.logs.push(`Temp folder created: ${unzipPath}....`);

    await FS.unzip(zipPath, unzipPath);
    this.logs.push('Unzipped files....');

    // unfortunately, github wraps the repository files in a folder in the zip
    // so we get the first directory name and extract that automatically
    let firstDir = (await FS.getDirectories(unzipPath))[0];


    let target = subDir ? FS.join(unzipPath, firstDir, subDir) : FS.join(unzipPath, firstDir);
    await FS.move(target, projectDir);
    this.logs.push(`Moved directory to ${projectDir}....`);
  }

  async execute() {
    return {
      goToNextStep: this.finished
    };
  }
}
