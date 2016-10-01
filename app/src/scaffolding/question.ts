import {inject, bindable, NewInstance} from 'aurelia-framework';
import {ValidationRules}               from 'aurelia-validatejs';
import {ValidationController}          from 'aurelia-validation';
import {IStep}           from './istep';
import {WorkflowContext} from './workflow-context';

/**
 * Question is a screen that asks a generic question, and sets the answer
 * to a specific property of the wizard state
 */
@inject(NewInstance.of(ValidationController), Element)
export class Question {
  step: IStep;
  state: any;

  constructor(public validation: ValidationController,
              private element: Element) {
  }

  activate(model: { context: WorkflowContext }) {
    this.step = model.context.workflow.currentStep;
    this.state = model.context.state;

    model.context.onNext(() => this.next());
  }

  async next() {
    this.state[this.step.stateProperty] = this.step.answer;

    return this.validation.validate().length === 0;
  }

  // get the first form-control and focus that element
  focusInput() {
    let input = <HTMLElement>this.element.querySelectorAll('.form-control')[0];
    if (input) {
      input.focus();
    }
  }
}