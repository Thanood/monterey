import {Workflow, IStepExecutionStrategy} from '../workflow';
import {WorkflowContext}                  from '../workflow-context';
import {IStep}                            from '../istep';

export class BranchSwitch implements IStepExecutionStrategy {
  accepts(step: IStep) {
    return step.type === 'branch-switch';
  }

  next(step: IStep, workflow: Workflow, context: WorkflowContext) {
    let value = context.state[step.stateProperty];

    if (value.id) {
      value = value.id;
    }

    let branch = step.branches.find(x => x.case === value);

    if (!branch) {
      throw new Error(`Did not find a branch for '${step.stateProperty}': '${context.state[step.stateProperty]}'`);
    }

    workflow.next(branch.nextActivity);
  }

  previous(step: IStep, workflow: Workflow, context: WorkflowContext) {
    workflow.previous();
  }

  preprocess(steps: Array<IStep>) {}
}