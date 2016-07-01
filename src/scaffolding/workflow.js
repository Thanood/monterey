export class Workflow {
  currentStep = { id: 0, nextActivity: 1 };
  // the state contains the project configuration and is modified per step
  state = {};
  // some activity types can be run 'automatically' without the user having to press next
  flowSteps = ['state-assign', 'branch-switch', 'project-create', 'project-install'];
  _isLast = false;

  constructor(definition, state) {
    this.definition = definition;
    this.state = state;
    this.name = definition.name;

    this.defaultViewModels();
    this.next();
  }

  getStep(id) {
    return this.definition.activities.find(i => i.id === id);
  }

  async next() {
    let nextActivity = this.currentStep.nextActivity;

    if (!this.isFlowStep(this.currentStep)) {
      this.saveAnswer(this.currentStep);
    } else {
      switch (this.currentStep.type) {
      case 'state-assign':
        this.setState(this.currentStep);
        break;
      case 'branch-switch':
        nextActivity = this.branchSwitch();
        break;
      default:
        break;
      }
    }

    let nextStep = this.getStep(nextActivity);

    this.currentStep = nextStep;

    if (this.currentStep.type !== 'branch-switch' && !this.currentStep.nextActivity) {
      this._isLast = true;
      return false;
    }

    if (this.isFlowStep(this.currentStep)) {
      return await this.next();
    }

    return true;
  }

  isFlowStep(step) {
    return !!this.flowSteps.find(i => i === step.type);
  }

  get isLast() {
    return this._isLast;
  }

  // a branch switch indicates that the nextStep must be determined
  // from the value of a property on the state
  branchSwitch() {
    let val = this.state[this.currentStep.stateProperty];
    if (!val) {
      throw new Error(`property '${this.currentStep.stateProperty}' does not exist on state`, this.state);
    }
    // get the id property if there is one
    val = val.id ? val.id : val;
    let nextActivity;
    this.currentStep.branches.forEach(branch => {
      if (val === branch.case) {
        nextActivity = branch.nextActivity;
      }
    });

    if (!nextActivity) {
      throw new Error(`branch switch failed. Activity ${this.currentStep.id} did not have a branch that matched the value '${val}'`);
    }

    return nextActivity;
  }

  setState(step) {
    Object.assign(this.state, step.state);
  }

  saveAnswer(step) {
    if (step.stateProperty) {
      this.state[step.stateProperty] = step.answer;
    }
  }

  defaultViewModels() {
    this.definition.activities.forEach(activity => {
      if (!this.isFlowStep(activity) && !activity.viewModel) {
        activity.viewModel = './question';
      }
    });
  }
}
