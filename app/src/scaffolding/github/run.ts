import {WorkflowContext} from '../workflow-context';
import {IStep}           from '../istep';
import {GithubAPI, Notification, FS, autoinject, LogManager, Logger} from '../../shared/index';

const logger = <Logger>LogManager.getLogger('zip-scaffolder');

@autoinject()
export class Run {
  failed = false;
  failedMessage: string;
  finished = false;
  logs = [];
  step: IStep;
  model;
  state;
  context: WorkflowContext;
  promise: Promise<void>;

  constructor(private githubAPI: GithubAPI,
              private notification: Notification) {
  }

  activate(model: { context: WorkflowContext }) {
    this.state = model.context.state;
    this.context = model.context;

    this.context.onNext(() => this.next());
  }

  async previous() {
    this.notification.warning('This is not possible at this point');
    return {
      goToPreviousStep: false
    };
  }

  async attached() {
    await this.go();
  }

  async go() {
    this.finished = false;
    this.failed = false;
    this.failedMessage = null;
    this.logs.splice(0);

    try {
      logger.info(`creating GitHub project: ${JSON.stringify(this.state)}`);

      let url;
      let subDir;
      let projectDir = FS.join(this.state.path, this.state.name);

      let releaseInfo = await this.githubAPI.getLatestReleaseZIP(this.state.github.repo);
      url = releaseInfo.zipball_url;
      subDir = this.state.github.subfolder;
      this.logs.push(`Downloading version ${releaseInfo.tag_name}`);

      await this.downloadAndExtractZIP(url, projectDir, subDir);

      this.finished = true;
      this.state.successful = true;

      this.context.next();

      try {
        FS.cleanupTemp();
        this.logs.push('Cleaned up temp files and folders');
      } catch (e) {
        logger.info('Did not finish cleanup of temp folder: ' + e.message);
      }
    } catch (e) {
      this.notification.error('Error while creating the application: ' + e.message);
      logger.error(e);
      this.failed = true;

      if (e.message.startsWith('EPERM')) {
        this.failedMessage = 'Do you have enough permissions to create this folder? Also try to disable your antivirus as it may be blocking this action\r\n' + e.message;
      } else {
        this.failedMessage = e.message;
      }

      this.state.successful = false;
    }
  }

  async downloadAndExtractZIP(url, projectDir, subDir) {
    this.logs.push(`Creating temp file....`);
    let zipPath = await FS.getTempFile();
    this.logs.push(`Temp file created: ${zipPath}`);
    this.logs.push('Downloading zip....');
    await FS.downloadFile(url, zipPath);
    this.logs.push('Downloaded zip');


    this.logs.push(`Creating temp folder....`);
    let unzipPath = await FS.getTempFolder();
    this.logs.push(`Temp folder created: ${unzipPath}`);

    this.logs.push('Unzipping files....');
    await FS.unzip(zipPath, unzipPath);

    // unfortunately, github wraps the repository files in a folder in the zip
    // so we get the first directory name and extract that automatically
    let firstDir = (await FS.getDirectories(unzipPath))[0];


    let target = subDir ? FS.join(unzipPath, firstDir, subDir) : FS.join(unzipPath, firstDir);
    this.logs.push(`Going to move directory to ${projectDir}....`);

    await FS.move(target, projectDir);
    this.logs.push(`Moved directory to ${projectDir}....`);
  }

  async next() {
    if (this.finished && this.failed) {
      this.notification.warning('Can\'t go to the next step until this step successfuly finishes');
      return;
    }

    return this.finished && !this.failed;
  }
}
