import {LogManager}      from 'aurelia-framework';
import {IStep}           from './istep';
import {WorkflowContext} from './workflow-context';

import {BranchSwitch, StateAssign, Input, Screen, ProjectInstall, ProjectCreate} from './strategies/index';

const logger = LogManager.getLogger('workflow');

/**
 * The workflow is the engine behind the wizard. It walks through a JSON file (activities.json) using next/previous actions
 */
export class Workflow {
  currentStep: IStep;
  context: WorkflowContext;
  firstScreen: IStep;
  previousSteps: Array<IStep> = [];
  strategies: Array<IStepExecutionStrategy> = [
    new BranchSwitch(),
    new StateAssign(),
    new Input(),
    new Screen(),
    new ProjectInstall(),
    new ProjectCreate()
  ];

  constructor(public steps: Array<IStep>) {
    this.context = new WorkflowContext(this);

    for (let strategy of this.strategies) {
      strategy.preprocess(steps);
    }
  }

  get isLastStep() {
    return this.currentStep.type === 'project-install';
  }

  get isFirstScreen() {
    return this.firstScreen === this.currentStep;
  }

  next(id: number) {
    if (!id) {
      return;
    }

    if (this.currentStep) {
      this.previousSteps.push(this.currentStep);
    }

    this.currentStep = this.steps.find(x => x.id === id);

    for (let strategy of this.strategies) {
      if (strategy.accepts(this.currentStep)) {
        strategy.next(this.currentStep, this, this.context);
      }
    }
  }

  previous() {
    if (this.currentStep === this.firstScreen) return;

    this.currentStep = this.previousSteps[this.previousSteps.length - 1];

    this.previousSteps.pop();

    for (let strategy of this.strategies) {
      if (strategy.accepts(this.currentStep)) {
        strategy.previous(this.currentStep, this, this.context);
      }
    }
  }
}

export interface IStepExecutionStrategy {
  accepts: (step: IStep) => boolean;
  preprocess(steps: Array<IStep>): void;
  next: (step: IStep, workflow: Workflow, context: WorkflowContext) => void;
  previous: (step: IStep, workflow: Workflow, context: WorkflowContext) => void;
}