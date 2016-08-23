import {LogManager, autoinject} from 'aurelia-framework';
import {Logger}            from 'aurelia-logging';
import {DialogService}     from 'aurelia-dialog';
import {FS}                from 'monterey-pal';
import {ApplicationState}  from '../../shared/application-state';
import {FileSelectorModal} from '../../shared/file-selector-modal/file-selector-modal';
import {Project}           from '../../shared/project';

const logger = <Logger>LogManager.getLogger('gulp-detection');

@autoinject()
export class GulpDetection {

  constructor(private dialogService: DialogService,
              private state: ApplicationState) {}

  async findGulpConfig(project: Project) {
    let lookupPaths = [
      FS.join(project.path, 'gulpfile.js'),
      FS.join(project.path, 'src', 'skeleton', 'gulpfile.js'),
      FS.join(project.path, 'src', 'skeleton-navigation-esnext-vs', 'gulpfile.js'),
      FS.join(project.path, 'src', 'skeleton-navigation-typescript-vs', 'gulpfile.js')
    ];

    if(project.packageJSONPath) {
      lookupPaths.push(FS.join(FS.getFolderPath(project.packageJSONPath), 'gulpfile.js'));
    }

    for (let i = 0; i < lookupPaths.length; i++) {
      if (await FS.fileExists(lookupPaths[i])) {
        project.gulpfile = lookupPaths[i];
        logger.info(`gulp file found: ${project.gulpfile}`);
      }
    };

    if (!project.gulpfile) {
      logger.info(`did not find gulpfile`);
    }
  }

  async manualDetection(project: Project) {
    let result = await this.dialogService.open({ 
      viewModel: FileSelectorModal, 
      model: { 
        description: 'In order to enable Gulp features, please select gulpfile.js',
        expectedFileName: 'gulpfile.js',
        filters: [
          { name: 'Javascript', extensions: ['js'] }
        ]
      }
    });

    if (!result.wasCancelled) {
      project.gulpfile = result.output;

      await this.state._save();
    }
  }
}