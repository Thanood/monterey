import {WorkflowContext} from './workflow-context';

// /**
//  * The ProjectDescription screen shows what options the user selected
//  * in the wizard. This is the last chance for users to go back and make changes.
//  */
export class ProjectDescription {
  state: any;

  activate(model: { context: WorkflowContext }) {
    this.state = model.context.state;

    model.context.title = 'Project configuration';
  }
}
