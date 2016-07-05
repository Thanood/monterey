export class ProjectDescription {
  async activate(model) {
    this.state = model.state;
    this.step = model.step;
    this.step.execute = () => this.execute();
    this.step.previous = () => this.previous();
  }

  async execute() {
    return {
      goToNextStep: true
    };
  }

  async previous() {
    return {
      goToPreviousStep: true
    };
  }
}
