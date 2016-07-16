import {bindable}            from 'aurelia-framework';
import {Project as IProject} from '../../shared/project';

export class Project {
  @bindable project: IProject;
}
