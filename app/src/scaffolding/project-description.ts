import {autoinject}       from 'aurelia-framework';
import {IStep}            from './istep';
import {ScaffoldProject}  from './scaffold-project';

/**
 * The ProjectDescription screen shows what options the user selected
 * in the wizard. This is the last chance for users to go back and make changes.
 */
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
