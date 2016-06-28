export class ProjectDescription {
  async activate(model) {
    this.state = model.state;
    this.step = model.step;
    this.step.execute = () => this.execute();
  }

  async execute() {
    return {
      goToNextStep: true
    };
  }
}
