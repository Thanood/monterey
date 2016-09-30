import {Workflow, IStepExecutionStrategy} from '../workflow';
import {WorkflowContext}                  from '../workflow-context';
import {IStep}                            from '../istep';

export class StateAssign implements IStepExecutionStrategy {
  accepts(step: IStep) {
    return step.type === 'state-assign';
  }

  next(step: IStep, workflow: Workflow, context: WorkflowContext) {
    Object.assign(context.state, step.state);
    workflow.next(step.nextActivity);
  }

  previous(step: IStep, workflow: Workflow, context: WorkflowContext) {
    workflow.previous();
  }

  preprocess(steps: Array<IStep>) {}
}