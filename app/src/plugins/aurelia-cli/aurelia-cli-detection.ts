import {LogManager, autoinject} from 'aurelia-framework';
import {Logger}            from 'aurelia-logging';
import {DialogService}     from 'aurelia-dialog';
import {FS}                from 'monterey-pal';
import {ApplicationState}  from '../../shared/application-state';
import {FileSelectorModal} from '../../shared/file-selector-modal/file-selector-modal';
import {Project}           from '../../shared/project';

const logger = <Logger>LogManager.getLogger('aurelia-cli-detection');

@autoinject()
export class AureliaCLIDetection {

  constructor(private dialogService: DialogService,
              private state: ApplicationState) {}

  async findAureliaJSONConfig(project: Project) {
    let lookupPaths = [
      FS.join(project.path, 'aurelia_project', 'aurelia.json')
    ];

    for (let i = 0; i < lookupPaths.length; i++) {
      if (await FS.fileExists(lookupPaths[i])) {
        project.aureliaJSONPath = lookupPaths[i];
        logger.info(`aurelia.json found: ${project.aureliaJSONPath}`);
      }
    };

    if (!project.aureliaJSONPath) {
      logger.info(`did not find aurelia.json file`);
    }
  }

  async manualDetection(project: Project) {
    let result = await this.dialogService.open({ 
      viewModel: FileSelectorModal, 
      model: { 
        description: 'In order to enable AureliaCLI features, please select the aurelia.json file',
        expectedFileName: 'aurelia.json',
        filters: [
          { name: 'JSON', extensions: ['json'] }
        ]
      }
    });

    if (!result.wasCancelled) {
      project.aureliaJSONPath = result.output;

      await this.state._save();
    }
  }
}