export class NPMPackageManager {
  activate(model) {
    this.project = model.project;
    this.plugin = model.plugin;
  }

  launch() {
    alert('launch');
  }
}
