import {Step} from './step';

export class Phase {
  steps: Array<Step> = [];
  checked: boolean = true;

  constructor(public identifier: string,
              public description?: string) {
    if (!description) {
      this.description = identifier;
    }
  }

  addStep(step: Step) {
    if (!step.order) {
      if (this.steps.length > 0) {
        step.order = this._getHighestOrder();
      } else {
        step.order = 1;
      }
    }

    this.steps.push(step);

    return step;
  }

  stepExists(identifier: string) {
    return this.steps.findIndex(x => x.identifier === identifier) > -1;
  }

  getStep(identifier: string) {
    return this.steps.find(x => x.identifier === identifier);
  }

  _getHighestOrder() {
    return Math.max(...this.steps.map(x => x.order)) + 1;
  }

  sort() {
    this.steps = this.steps.sort((a, b) => a.order - b.order);
  }

  moveAfter(a: Step, b: Step) {
    if (this.steps.findIndex(x => x.order === b.order + 1) > -1) {
      this.steps.forEach(step => {
        if (step.order > b.order) {
          step.order ++;
        }
      });
    }

    a.order = b.order + 1;
  }
}