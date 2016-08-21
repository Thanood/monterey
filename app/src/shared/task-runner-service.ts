import {Project, ProjectTask} from './project';
import {autoinject, Container} from 'aurelia-framework';
import {GulpService} from '../plugins/gulp/gulp-service';
import {WebpackService} from '../plugins/webpack/webpack-service';
import {AureliaCLIService} from '../plugins/aurelia-cli/aurelia-cli-service';

export interface TaskRunnerService {
  cancelTask(process);
  runTask(project: Project, task: ProjectTask, stdout, stderr);
  getTasks(project: Project, useCache: boolean): Promise<Array<ProjectTask>>;
}

@autoinject()
export class ServiceLocator {
  constructor(private container: Container) {}

  get(project: Project) {
    if (project.isUsingGulp()) {
      return this.container.get(GulpService);
    } else if (project.isUsingAureliaCLI()) {
      return this.container.get(AureliaCLIService);
    } else if (project.isUsingWebpack()) {
      return this.container.get(WebpackService);
    }
  }
}