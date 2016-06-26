export class WorkflowHelper {
  currentStep = { id: 0, nextActivity: 1 };
  state = {};

  constructor(definition) {
    this.definition = definition;
    this.name = definition.name;

    this.next();
  }

  getStep(id) {
    return this.definition.activities.find(i => i.id === id);
  }

  next() {
    this.saveAnswer(this.currentStep);

    let nextStep = this.getStep(this.currentStep.nextActivity);
    if (!nextStep) { return false; }

    let isUserStep = false;

    switch (nextStep.type) {
    case 'state-assign':
      this.setState(nextStep.state);
      break;
    // case 'branch-switch':
    //   nextStep = this.branchSwitch(nextStep);
    //   break;
    default:
      isUserStep = true;
      break;
    }

    this.currentStep = nextStep;

    if (!isUserStep) {
      this.next();
      return;
    }
  }

  // branchSwitch() {
  //
  // }

  setState(state) {
    Object.assign(this.state, state);
    console.log('State: ',  this.state);
  }

  saveAnswer(step) {
    if (step.stateProperty) {
      this.state[step.stateProperty] = step.answer;
    }
    console.log('State: ',  this.state);
  }
}
