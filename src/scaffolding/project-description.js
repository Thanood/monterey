export class ProjectDescription {
  async activate(model) {
    this.state = model.state;
    this.step = model.step;
    this.step.next = () => this.next();
  }

  async next() {
    this.step.hasFinished = true;
  }
}
