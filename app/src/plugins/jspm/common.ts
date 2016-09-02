import {LogManager} from 'aurelia-framework';
import {Logger}     from 'aurelia-logging';
import {JSPM, FS}   from 'monterey-pal';
import {Task}       from '../../plugins/task-manager/task';
import {Project}    from '../../shared/project';

const logger = <Logger>LogManager.getLogger('jspm-detection');

export class Common {

  install(project: Project, deps, jspmOptions = null, withLoader = false) {
    let workingDirectory = FS.getFolderPath(project.packageJSONPath);

    // always supply a workingDirectory so that
    // we're not jspm installing in monterey directory
    Object.assign(jspmOptions, {
      workingDirectory: workingDirectory
    });

    let task = new Task(project, 'JSPM install');
    task.estimation = 'This usually takes about a minute to complete';

    task.execute = async () => {
      if (!await this.isJSPMInstalled(project)) {
        return Promise.reject('JSPM is not installed, cannot execute this action');
      }

      let promise = JSPM.install(deps, {
        project: project,
        jspmModulesPath: project.__meta__.jspmModulesPath,
        jspmOptions: jspmOptions,
        logCallback: (message) => {
          task.addTaskLog(message.message);
        }
      });

      if (withLoader) {
        promise = promise.then(() => this.downloadLoader(project, (message) => {
          task.addTaskLog(message.message);
        }));
      }

      return promise;
    }

    return task;
  }

  downloadLoader(project: Project, callback) {
    let workingDirectory = FS.getFolderPath(project.packageJSONPath);

    return JSPM.downloadLoader({
      project: project,
      jspmModulesPath: project.__meta__.jspmModulesPath,
      jspmOptions: {
        workingDirectory: workingDirectory
      },
      logCallback: callback
    });
  }

  async getConfig(project: Project) {
    return await JSPM.getConfig({
      jspmModulesPath: project.__meta__.jspmModulesPath,
      project: project
    });
  }

  async getForks(project: Project, config: any) {
    // get list of forks
    return JSPM.getForks(config, {
      project: project,
      jspmModulesPath: project.__meta__.jspmModulesPath,
      jspmOptions: {
        workingDirectory: FS.getFolderPath(project.packageJSONPath)
      }
    })
  }

  /**
   * Do we know of a locally or globally installed jspm?
   */
  async isJSPMInstalled(project: Project) {
    if (project.__meta__.jspmModulesPath === undefined) {
      project.__meta__.jspmModulesPath = await this.getJSPMModulesPath(project);
    }

    return project.__meta__.jspmModulesPath;
  }

  async getJSPMModulesPath(project: Project) {
    let lookupPaths = [
      // local node_modules
      FS.join(FS.getFolderPath(project.packageJSONPath), 'node_modules', 'jspm'),
      // global node_modules
      FS.join(FS.getGlobalNodeModulesPath(), 'jspm')
    ];

    for(let x = 0; x < lookupPaths.length; x++) {
      let jspmApiFile = FS.join(lookupPaths[x], 'api.js');

      if (await FS.fileExists(jspmApiFile)) {
        logger.info(`found jspm in this node_modules folder: ${lookupPaths[x]}`);
        return lookupPaths[x];
      }
    }
    
    logger.info(`did not find a node_modules folder with jspm installed. tried: [${lookupPaths.join(', ')}]`);
  }
}