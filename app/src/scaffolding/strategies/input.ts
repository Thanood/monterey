import {Workflow, IStepExecutionStrategy} from '../workflow';
import {WorkflowContext}                  from '../workflow-context';
import {IStep}                            from '../istep';

export class Input implements IStepExecutionStrategy {
  accepts(step: IStep) {
    return step.type === 'input-text' || step.type === 'input-select';
  }

  next(step: IStep, workflow: Workflow, context: WorkflowContext) {
    if (!workflow.firstScreen) {
      workflow.firstScreen = step;
    }
    if (!step.viewModel) {
      step.viewModel = 'scaffolding/question';
    }

    let state = workflow.context.state;

    if (state[step.stateProperty] && !step.answer) {
      step.answer = state[step.stateProperty];
    }

    // select first item for input-select questions
    if (step.type === 'input-select') {
      if (!step.answer) {
        step.answer = step.options[0].value;
      } else {
        // make sure that we use the correct instance of the selected option
        // otherwise the radio button won't be checked for the default value
        step.answer = step.options.find(i => i.value.id === step.answer.id).value;
      }
    }
  }

  previous(step: IStep, workflow: Workflow, context: WorkflowContext) {}

  preprocess(steps: Array<IStep>) {
    for (let step of steps) {
      if (step.stateProperty === 'name') {
        step.stateProperty = undefined;
        step.type = 'screen';
        step.viewModel = '../project-name';
      }
    }
  }
}