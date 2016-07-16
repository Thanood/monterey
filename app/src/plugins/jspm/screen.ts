import {autoinject}       from 'aurelia-framework';
import {JSPM, FS}         from 'monterey-pal';
import {DialogService}    from 'aurelia-dialog';
import {TaskManager}      from '../../task-manager/task-manager';
import {TaskManagerModal} from '../../task-manager/task-manager-modal';
import {Analyzer}         from './analyzer';
import {Forks}            from './forks';
import {withModal}        from '../../shared/decorators';

@autoinject()
export class Screen {

  model;
  project;
  loading = false;
  projectGrid;
  topLevelDependencies = [];
  allDependencies = [];
  workingDirectory;
  forks = [];

  constructor(private taskManager: TaskManager,
              private analyzer: Analyzer,
              private dialogService: DialogService) {
  }

  async activate(model) {
    this.model = model;
    this.project = model.selectedProject;

    this.workingDirectory = FS.getFolderPath(this.project.packageJSONPath);
  }

  async attached() {
    if (!(await this.analyzer.githubAPI.confirmAuth())) {
      alert('Due to Github\'s rate limiting system, Github credentials are required in order to use this functionality');
      return;
    }

    this.loading = true;

    try {
      await this.load();
    } catch (e) {
      alert(`Error loading JSPM dependencies: ${e.message}`);
      console.log(e);
    }

    this.loading = false;
  }

  async load() {
    // clear old dependency list
    let count = this.topLevelDependencies.length;
    for (let i = count; i >= 0; i--) {
      this.topLevelDependencies.splice(i, 1);
    }

    this.forks = [];

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

    // get list of forks
    JSPM.getForks(config, { jspmOptions: { workingDirectory: this.workingDirectory }})
    .then(forks => this.forks = forks);
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
    return JSPM.downloadLoader({
      jspmOptions: {
        workingDirectory: this.workingDirectory
      },
      logCallback: callback
    });
  }

  install(deps, jspmOptions = null) {
    // always supply a workingDirectory so that
    // we're not jspm installing in monterey directory
    Object.assign(jspmOptions, {
      workingDirectory: this.workingDirectory
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

  @withModal(Forks, function () { return { forks: this.forks }; })
  showForks() {}
}
