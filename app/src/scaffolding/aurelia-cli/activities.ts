// import {Workflow}   from '../workflow';
import {FS}              from 'monterey-pal';
import {WorkflowContext} from '../workflow-context';
import {Workflow} from '../workflow';

export class Activities {
  cli_context: WorkflowContext;
  cli_workflow: Workflow;

  async activate(model: { context: WorkflowContext }) {
    model.context.onNext(() => this.next());
    model.context.onPrevious(() => this.previous());

    let definition = JSON.parse(await FS.readFile(FS.join(FS.getRootDir(), 'node_modules/aurelia-cli/lib/commands/new/new-application.json')));

    this.cli_workflow = (<any>model.context).cli_workflow;

    if (!this.cli_workflow) {
      this.cli_workflow = (<any>model.context).cli_workflow = new Workflow(definition.activities);
      this.cli_workflow.context.state = model.context.state;

      await this.cli_workflow.next(1);
    } else {
      if (this.cli_workflow.isLastStep) {
        this.cli_workflow.previous();
      }
    }

    this.cli_context = this.cli_workflow.context;
  }

  async next() {
    await this.cli_context.next();
    return this.cli_workflow.isLastStep;
  }

  async previous() {
    if (this.cli_workflow.currentStep === this.cli_workflow.firstScreen) {
      return true;
    } else {
      await this.cli_context.previous();
      return false;
    }
  }
}