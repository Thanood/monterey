import {autoinject}     from 'aurelia-framework';
import {IStep}          from './istep';
import {FS}             from 'monterey-pal';
import {ProjectManager} from '../shared/project-manager';
import {Project}        from '../shared/project';

@autoinject()
export class PostCreate {
  state;
  step: IStep;
  actions: Array<any> = [];
  project: Project;

  constructor(private projectManager: ProjectManager) {}

  async activate(model) {
    this.state = model.state;
    this.step = model.step;
    this.step.execute = () => this.execute();
    this.step.previous = () => this.previous();

    await this.addProject();

    this.determineActions();
  }

  determineActions() {
    this.actions = [{
      name: 'Install NPM dependencies',
      checked: true
    }];

    if (this.project.isUsingJSPM()) {
      this.actions.push({
        name: 'Install JSPM dependencies',
        checked: true
      });
    }

    if (this.project.isUsingAureliaCLI()) {
      this.actions.push({
        name: 'Start the project (au run --watch)',
        checked: true
      });
    }

    if (this.project.isUsingGulp()) {
      this.actions.push({
        name: 'Start the project (gulp watch)',
        checked: true
      });
    }

    // this.actions.push({
    //   name: 'open project in',
    //   checked: true,
    //   options: [{
    //     name: 'Visual Studio Code',
    //     value: 'Visual Studio'
    //   }, {
    //     name: 'Atom',
    //     value: 'Atom'
    //   }]
    // });
  }

  async addProject() {
    this.state.path = FS.join(this.state.path, this.state.name);

    let proj = await this.projectManager.addProjectByWizardState(this.state);

    if (proj) {
      this.project = <Project>proj;
      this.step.project = this.project;
    }
  }

  async execute() {

    if (this.actions.find(x => x.name === 'Install NPM dependencies')) {

    }

    if (this.actions.find(x => x.name === 'Install JSPM dependencies')) {

    }

    if (this.actions.find(x => x.name === 'Start the project (au run --watch)')) {

    }

    if (this.actions.find(x => x.name === 'Start the project (gulp watch)')) {

    }

    return {
      goToNextStep: true
    };
  }

  async previous() {
    return {
      goToPreviousStep: true
    };
  }
}
