import {Workflow, IStepExecutionStrategy} from '../workflow';
import {WorkflowContext}                  from '../workflow-context';
import {IStep}                            from '../istep';

export class ProjectCreate implements IStepExecutionStrategy {
  accepts(step: IStep) {
    return step.type === 'project-create';
  }

  next(step: IStep, workflow: Workflow, context: WorkflowContext) {
    workflow.next(step.nextActivity);
  }

  previous(step: IStep, workflow: Workflow, context: WorkflowContext) {
    workflow.previous();
  }

  preprocess(steps: Array<IStep>) {}
}