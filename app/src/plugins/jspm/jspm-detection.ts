import {LogManager, autoinject} from 'aurelia-framework';
import {Logger}                 from 'aurelia-logging';
import {DialogService}          from 'aurelia-dialog';
import {FS}                     from 'monterey-pal';
import {FileSelectorModal}      from '../../shared/file-selector-modal';
import {ApplicationState, Project} from '../../shared/index';

const logger = <Logger>LogManager.getLogger('jspm-detection');

@autoinject()
export class JSPMDetection {

  constructor(private dialogService: DialogService,
              private state: ApplicationState) {}

  async findJspmConfig(project: Project) {
    if (!project.packageJSONPath) {
      // no package.json? no jspm
      return;
    }

    let packageJSON = JSON.parse(await FS.readFile(project.packageJSONPath));
    let configJs = null;

    if (packageJSON.jspm) {

      logger.info('package.json has jspm section');

      this.findJspmVersion(project, packageJSON);

      let jspm016Path = this.getJspm016Path(project, packageJSON);
      let jspm017Path = this.getJspm017Path(project, packageJSON);

      logger.info(`jspm016Path: ${jspm016Path}`);
      logger.info(`jspm017Path: ${jspm017Path}`);

      // we were unable to find JSPM in the devDependencies section of package.json
      // so we're just going to look for a config.js or a jspm.config.js
      // in order to try and determine what JSPM version is being used
      if (!project.jspmVersion) {
        if (await FS.fileExists(jspm016Path)) {
          project.configJsPath = jspm016Path;
          project.jspmVersion = '^0.16.0';
          project.jspmDefinition = '^0.16.0';
          logger.info(`jspm 0.16 detected`);
        } else if (await FS.fileExists(jspm017Path)) {
          project.configJsPath = jspm017Path;
          project.jspmVersion = '^0.17.0';
          project.jspmDefinition = '^0.17.0';
          logger.info(`jspm 0.17 detected`);
        }
      } else {
        let major = parseInt(project.jspmVersion.split('.')[0], 10);
        let minor = parseInt(project.jspmVersion.split('.')[1], 10);
        if (major === 0) {
          if (minor < 17) {
            project.configJsPath = jspm016Path;
          } else {
            project.configJsPath = jspm017Path;
          }
        }
      }
    }
  }

  getJspm016Path(project, packageJSON) {
    let baseURL = '';
    if (packageJSON.jspm.directories && packageJSON.jspm.directories.baseURL) {
      baseURL = packageJSON.jspm.directories.baseURL;
    }
    return FS.join(project.path, baseURL, 'config.js');
  }

  getJspm017Path(project, packageJSON) {
    // TODO: implement reading JSPM 0.17.x configuration
    let baseURL = '';
    if (packageJSON.jspm.directories && packageJSON.jspm.directories.baseURL) {
      baseURL = packageJSON.jspm.directories.baseURL;
    }
    return FS.join(project.path, baseURL, 'jspm.config.js');
  }

  findJspmVersion(project, packageJSON) {
    let jspmDefinition = (packageJSON.dependencies && packageJSON.dependencies.jspm) || (packageJSON.devDependencies && packageJSON.devDependencies.jspm);
    let jspmVersion = null;
    if (jspmDefinition) {
      jspmVersion = jspmDefinition;
      if (jspmVersion[0] === '^' || jspmVersion[0] === '~') {
        // TODO: find version actually used
        jspmVersion = jspmVersion.substring(1);
      }
      project.jspmDefinition = jspmDefinition;
      project.jspmVersion = jspmVersion;
    }
  }

  async manualDetection(project: Project) {
    let result = await this.dialogService.open({
      viewModel: FileSelectorModal,
      model: {
        description: 'In order to enable JSPM features, please select the config.js or jspm.config.js file',
        expectedFileName: 'config.js/jspm.config.js',
        filters: [
          { name: 'Javascript', extensions: ['js'] }
        ]
      }
    });

    if (!result.wasCancelled) {
      if (result.output.endsWith('jspm.config.js')) {
        project.jspmVersion = '^0.17.0';
        project.configJsPath = result.output;
      } else if (result.output.endsWith('config.js')) {
        project.jspmVersion = '^0.16.0';
        project.configJsPath = result.output;
      }

      await this.state._save();
    }
  }
}