import {LogManager, autoinject} from 'aurelia-framework';
import {Logger}            from 'aurelia-logging';
import {DialogService}     from 'aurelia-dialog';
import {FS}                from 'monterey-pal';
import {ApplicationState}  from '../../shared/application-state';
import {FileSelectorModal} from '../../shared/file-selector-modal/file-selector-modal';
import {Project}           from '../../shared/project';

const logger = <Logger>LogManager.getLogger('webpack-detection');

@autoinject()
export class WebpackDetection {

  constructor(private dialogService: DialogService,
              private state: ApplicationState) {}

  async findWebpackConfig(project: Project) {
    let lookupPaths = [
      FS.join(project.path, 'webpack.config.js')
    ];

    for (let i = 0; i < lookupPaths.length; i++) {
      if (await FS.fileExists(lookupPaths[i])) {
        project.webpackConfigPath = lookupPaths[i];
        logger.info(`webpack.config.js found: ${project.webpackConfigPath}`);
      }
    };

    if (!project.webpackConfigPath) {
      logger.info(`did not find webpack.config.js`);
    }
  }

  async manualDetection(project: Project) {
    let result = await this.dialogService.open({ 
      viewModel: FileSelectorModal, 
      model: { 
        description: 'In order to enable Webpack features, please select the webpack.config.js',
        expectedFileName: 'webpack.config.js',
        filters: [
          { name: 'Javascript', extensions: ['js'] }
        ]
      }
    });

    if (!result.wasCancelled) {
      project.webpackConfigPath = result.output;

      await this.state._save();
    }
  }
}