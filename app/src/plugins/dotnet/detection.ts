import {LogManager, autoinject} from 'aurelia-framework';
import {Logger}            from 'aurelia-logging';
import {DialogService}     from 'aurelia-dialog';
import {FS}                from 'monterey-pal';
import {FileSelectorModal} from '../../shared/file-selector-modal';
import {ApplicationState, Project} from '../../shared/index';

const logger = <Logger>LogManager.getLogger('dotnet-detection');

@autoinject()
export class Detection {

  constructor(private dialogService: DialogService,
              private state: ApplicationState) {}

  async detect(project: Project) {
    let lookupPaths = [
      FS.join(project.path, 'project.json')
    ];

    if (project.packageJSONPath) {
      lookupPaths.push(FS.join(FS.getFolderPath(project.packageJSONPath), 'project.json'));
    }

    for (let i = 0; i < lookupPaths.length; i++) {
      if (await FS.fileExists(lookupPaths[i])) {
        project.projectJSONPath = lookupPaths[i];
        logger.info(`project.json file found: ${project.projectJSONPath}`);
      }
    };

    if (!project.projectJSONPath) {
      logger.info(`did not find project.json file`);
    }
  }

  async manualDetection(project: Project) {
    let result = await this.dialogService.open({
      viewModel: FileSelectorModal,
      model: {
        description: 'In order to enable dotnet features, please select the project.json file of your project',
        expectedFileName: 'project.json',
        filters: [
          { name: 'JSON', extensions: ['json'] }
        ]
      }
    });

    if (!result.wasCancelled) {
      project.projectJSONPath = result.output;

      await this.state._save();
    }
  }
}