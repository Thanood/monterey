import {Workflow} from './workflow';
import {Project}  from '../shared/project';

export class WorkflowContext {
  _next: () => Promise<boolean>;
  _previous: () => Promise<boolean>;

  nextButtonText: string;
  nextButtonVisible = true;
  previousButtonText: string;
  previousButtonVisible = true;
  closeButtonText: string;
  closeButtonVisible = true;
  title: string;
  state: any = {};

  // post-create creates the project and uses
  // this property to pass the created project to the modal
  // which returns the project when the modal is closed
  project?: Project;

  constructor(public workflow: Workflow) {
    this.reset();
  }

  onNext(cb: () => Promise<boolean>) {
    this._next = cb;
  }

  onPrevious(cb: () => Promise<boolean>) {
    this._previous = cb;
  }

  get isFirstScreen() {
    return this.workflow.currentStep === this.workflow.firstScreen;
  }

  async next() {
    if (this._next && await this._next()) {
      this.reset();
      this.workflow.next(this.workflow.currentStep.nextActivity);
    }
  }

  async previous() {
    if (this._previous && await this._previous()) {
      this.reset();
      this.workflow.previous();
    }
  }

  reset() {
    this.nextButtonText = 'Next';
    this.previousButtonText = 'Previous';
    this.closeButtonText = 'Close';
    this.nextButtonVisible = true;
    this.closeButtonVisible = true;
    this.previousButtonVisible = true;
    this.title = 'Create new application';
    this._next = async () => true;
    this._previous = async () => true;
  }
}