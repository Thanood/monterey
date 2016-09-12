import {LogManager, autoinject} from 'aurelia-framework';
import {Logger}            from 'aurelia-logging';
import {DialogService}     from 'aurelia-dialog';
import {FS}                from 'monterey-pal';
import {ApplicationState}  from '../../shared/application-state';
import {FileSelectorModal} from '../../shared/file-selector-modal/file-selector-modal';
import {Project}           from '../../shared/project';

const logger = <Logger>LogManager.getLogger('npm-detection');

@autoinject()
export class NPMDetection {

  constructor(private dialogService: DialogService,
              private state: ApplicationState) {}

  async findPackageJSON(project: Project) {
    let pathsToTry = [
      FS.join(project.path, 'package.json'),
      FS.join(project.path, 'src/skeleton/package.json'),
      FS.join(project.path, 'src/skeleton-navigation-esnext-vs/package.json'),
      FS.join(project.path, 'src/skeleton-navigation-typescript-vs/package.json')
    ];

    let found = false;
    for (let i = 0; i < pathsToTry.length; i++) {
      if (await this.tryLocatePackageJSON(project, pathsToTry[i])) {
        found = true;
        logger.info(`found package.json at ${pathsToTry[i]}`);
      }
    }

    if (!found) {
      logger.info(`did not find package.json`);
    }

    return project;
  }

  async tryLocatePackageJSON(project, p) {
    if (await FS.fileExists(p)) {
      project.packageJSONPath = FS.normalize(p);

      let packageJSON = await this.getPackageJSON(project);

      // if the project already has a name then it has just been scaffolded
      if (project.name) {
        // check if the name of the project is equal to the name mentioned in package.json
        if (packageJSON.name !== project.name) {
          // if not, update package.json to use the project name and persist this to the filesystem
          packageJSON.name = this.normalizePackageName(project.name);
          await FS.writeFile(project.packageJSONPath, JSON.stringify(packageJSON, null, 4));
        }
      } else {
        project.name = packageJSON.name;
      }

      return true;
    }

    return false;
  }

  // https://docs.npmjs.com/files/package.json#name        
  normalizePackageName(name: string) {
    name = name.replace(/\s/, '-');
    if (name[0] === '.' || name[0] === '_') {
      name = name.slice(1, name.length);
    }
    name = name.replace(/~/, '');

    if (name.length > 214) {
      name = name.slice(0, 214);
    }

    name = name.toLowerCase();

    return name;
  }

  async getPackageJSON(project) {
    return JSON.parse(await FS.readFile(project.packageJSONPath));
  }

  async manualDetection(project: Project) {
    let result = await this.dialogService.open({
      viewModel: FileSelectorModal,
      model: {
        description: 'In order to enable NPM features, please select the package.json',
        expectedFileName: 'package.json',
        filters: [
          { name: 'JSON', extensions: ['json'] }
        ]
      }
    });

    if (!result.wasCancelled) {
      project.packageJSONPath = result.output;

      await this.state._save();
    }
  }
}