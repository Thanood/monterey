export class WorkflowHelper {
  currentStep = { id: 0, nextActivity: 1 };
  // the state contains the project configuration and is modified per step
  state = {};
  // some activity types can be run 'automatically' without the user having to press next
  flowSteps = ['state-assign', 'branch-switch', 'project-create', 'project-install'];

  constructor(definition, aureliaCLI) {
    this.definition = definition;
    this.aureliaCLI = aureliaCLI;
    this.name = definition.name;

    this.next();
  }

  getStep(id) {
    return this.definition.activities.find(i => i.id === id);
  }

  async next() {
    let nextActivity = this.currentStep.nextActivity;

    if (!this.isFlowStep()) {
      this.saveAnswer(this.currentStep);
    } else {
      switch (this.currentStep.type) {
      case 'state-assign':
        this.setState(this.currentStep);
        break;
      case 'branch-switch':
        nextActivity = this.branchSwitch();
        break;
      case 'project-create':
        await this.aureliaCLI.create(this.state);
        break;
      case 'project-install':
        await this.aureliaCLI.install(this.state);
        break;
      default:
        break;
      }
    }

    let nextStep = this.getStep(nextActivity);
    if (this.isLastStep(nextActivity)) {
      return false;
    }

    this.currentStep = nextStep;

    if (this.isFlowStep()) {
      return await this.next();
    }

    return true;
  }

  isFlowStep() {
    return this.flowSteps.find(i => i === this.currentStep.type);
  }

  isLastStep(nextActivity) {
    return !nextActivity;
  }

  // a branch switch indicates that the nextStep must be determined
  // from the value of a property on the state
  branchSwitch() {
    let val = this.state[this.currentStep.stateProperty];
    let nextActivity;
    this.currentStep.branches.forEach(branch => {
      if (val === branch.case) {
        nextActivity = branch.nextActivity;
      }
    });

    return nextActivity;
  }

  setState(step) {
    Object.assign(this.state, step.state);
    console.log('State: ',  this.state);
  }

  saveAnswer(step) {
    if (step.stateProperty) {
      this.state[step.stateProperty] = step.answer;
    }
    console.log('State: ',  this.state);
  }
}
