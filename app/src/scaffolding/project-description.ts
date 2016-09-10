import {autoinject}       from 'aurelia-framework';
import {IStep}            from './istep';
import {ScaffoldProject}  from './scaffold-project';

@autoinject()
export class ProjectDescription {
  state;
  step: IStep;

  constructor(private scaffoldProject: ScaffoldProject) {}
            
  async activate(model) {
    this.state = model.state;
    this.step = model.step;
    this.step.execute = () => this.execute();
    this.step.previous = () => this.previous();

    this.scaffoldProject.title = 'Project configuration';
  }

  async execute() {
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
