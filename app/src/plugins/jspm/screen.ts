import {autoinject}       from 'aurelia-framework';
import {JSPM, FS}         from 'monterey-pal';
import {DialogService}    from 'aurelia-dialog';
import {TaskManager}      from '../../shared/task-manager';
import {TaskManagerModal} from '../../main/components/task-manager-modal';
import {Analyzer}         from './analyzer';

@autoinject()
export class Screen {

  model;
  project;
  a;
  jspm;
  config;
  process;
  loader;
  loading = false;
  projectGrid;
  topLevelDependencies = [];
  allDependencies = [];

  constructor(private taskManager: TaskManager,
              private analyzer: Analyzer,
              private dialogService: DialogService) {
  }

  async activate(model) {
    this.model = model;
    this.project = model.selectedProject;
  }

  async attached() {
    this.loading = true;

    await this.load();

    this.loading = false;
  }

  async load() {
    // clear old dependency list
    let count = this.topLevelDependencies.length;
    for (let i = count; i >= 0; i--) {
      this.topLevelDependencies.splice(i, 1);
    }

    let packageJSON = JSON.parse(await FS.readFile(this.project.packageJSONPath));
    let config = await JSPM.getConfig(this.project.path, this.project.packageJSONPath);

    this.allDependencies = this.analyzer.analyze(config.loader, packageJSON);

    // only show top level dependencies in the grid, sorted by package name
    this.topLevelDependencies =  this.allDependencies
      .filter(i => i.isTopLevel)
      .sort((a, b) => {
        if (a.package < b.package) return -1;
        if (a.package > b.package) return 1;
        return 0;
      });

    // don't do this synchronously, just continue with everything and latest version will
    // gradually come in
    this.analyzer.lookupLatest();
  }

  updateSelected() {
    let deps = this.getSelectedDependencies();
    let installDeps;

    if (deps.length ===  0) {
      alert('Please select at least one dependency');
      return;
    }

    installDeps = {};
    deps.forEach(dep => installDeps[dep.alias] = `${dep.name}@${dep.latest}`);

    let workingDirectory = FS.getFolderPath(this.project.packageJSONPath);
    this.install(installDeps, { lock: false, latest: true });
  }

  getSelectedDependencies(): Array<any> {
    let selection = this.projectGrid.ctx.vGridSelection.getSelectedRows();
    return selection.map(index => this.topLevelDependencies[index]);
  }

  updateAll() {
    this.install(true, { lock: false, update: true });
  }

  installAll() {
    let task = this.install(true, { lock: true });
    task.promise = task.promise
    .then(() => this.downloadLoader((message) => {
      this.taskManager.addTaskLog(task, message.message);
    }));
  }

  downloadLoader(callback) {
    let workingDirectory = FS.getFolderPath(this.project.packageJSONPath);
    return JSPM.downloadLoader({
      jspmOptions: {
        workingDirectory: workingDirectory
      },
      logCallback: callback
    });
  }

  install(deps, jspmOptions = null) {
    // always supply a workingDirectory so that
    // we're not jspm installing in monterey directory
    let workingDirectory = FS.getFolderPath(this.project.packageJSONPath);
    Object.assign(jspmOptions, {
      workingDirectory: workingDirectory
    });

    let task = <any>{
      title: `jspm install of '${this.project.name}'`,
      estimation: 'This usually takes about a minute to complete',
      logs: []
    };

    let promise = JSPM.install(deps, {
      jspmOptions: jspmOptions,
      logCallback: (message) => {
        this.taskManager.addTaskLog(task, message.message);
      }
    });

    task.promise = promise;

    this.taskManager.addTask(task);

    this.dialogService.open({ viewModel: TaskManagerModal, model: { task: task }});

    return task;
  }
}
