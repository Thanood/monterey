import {Workflow, IStepExecutionStrategy} from '../workflow';
import {WorkflowContext}                  from '../workflow-context';
import {IStep}                            from '../istep';

export class ProjectInstall implements IStepExecutionStrategy {
  accepts(step: IStep) {
    return step.type === 'project-install';
  }

  next(step: IStep, workflow: Workflow, context: WorkflowContext) {}

  previous(step: IStep, workflow: Workflow, context: WorkflowContext) {
    workflow.previous();
  }

  preprocess(steps: Array<IStep>) {}
}