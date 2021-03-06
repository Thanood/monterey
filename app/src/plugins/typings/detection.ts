import {FileSelectorModal} from '../../shared/file-selector-modal';
import {LogManager, autoinject, DialogService, Logger, FS, Project, ApplicationState} from '../../shared/index';

const logger = <Logger>LogManager.getLogger('typings-detection');

@autoinject()
export class Detection {

  constructor(private dialogService: DialogService,
              private state: ApplicationState) {}

  async findTypingsJSONFile(project: Project) {
    let lookupPaths = [
      FS.join(project.path, 'typings.json')
    ];

    if (project.packageJSONPath) {
      lookupPaths.push(FS.join(FS.getFolderPath(project.packageJSONPath), 'typings.json'));
    }

    for (let i = 0; i < lookupPaths.length; i++) {
      if (await FS.fileExists(lookupPaths[i])) {
        project.typingsJSONPath = lookupPaths[i];
        logger.info(`typings.json file found: ${project.typingsJSONPath}`);
      }
    };

    if (!project.typingsJSONPath) {
      logger.info(`did not find typings.json file`);
    }
  }

  async manualDetection(project: Project) {
    let result = await this.dialogService.open({
      viewModel: FileSelectorModal,
      model: {
        description: 'In order to enable Typings features, please select the typings.json file of your project',
        expectedFileName: 'typings.json',
        filters: [
          { name: 'JSON', extensions: ['json'] }
        ]
      }
    });

    if (!result.wasCancelled) {
      project.typingsJSONPath = result.output;

      await this.state._save();
    }
  }
}