import {Workflow, IStepExecutionStrategy} from '../workflow';
import {WorkflowContext}                  from '../workflow-context';
import {IStep}                            from '../istep';

export class Screen implements IStepExecutionStrategy {
  accepts(step: IStep) {
    return step.type === 'screen';
  }

  next(step: IStep, workflow: Workflow, context: WorkflowContext) {
    if (!workflow.firstScreen) {
      workflow.firstScreen = step;
    }
  }

  previous(step: IStep, workflow: Workflow, context: WorkflowContext) {}

  preprocess(steps: Array<IStep>) {}
}