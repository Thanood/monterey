import {autoinject}       from 'aurelia-framework';
import {JSPM, FS}         from 'monterey-pal';
import {DialogService}    from 'aurelia-dialog';
import {TaskManager}      from '../../plugins/task-manager/task-manager';
import {TaskManagerModal} from '../../plugins/task-manager/task-manager-modal';
import {Analyzer}         from './analyzer';
import {Forks}            from './forks';
import {withModal}        from '../../shared/decorators';
import {Project}          from '../../shared/project';
import {Notification}     from '../../shared/notification';
import {Common}           from './common';
import {Main}             from '../../main/main';

@autoinject()
export class Screen {

  model;
  project: Project;
  loading = false;
  projectGrid;
  topLevelDependencies = [];
  allDependencies = [];
  forks = [];

  constructor(private taskManager: TaskManager,
              private analyzer: Analyzer,
              private common: Common,
              private dialogService: DialogService,
              private notification: Notification,
              private main: Main) {
  }

  async activate(model) {
    this.model = model;
    this.project = model.selectedProject;
  }

  async attached() {
    if (!(await this.analyzer.githubAPI.confirmAuth())) {
      this.notification.error('Due to Github\'s rate limiting system, Github credentials are required in order to use this functionality');
      return;
    }

    if (!(await JSPM.isJspmInstalled(this.project.path))) {
      this.notification.error(`JSPM is not installed (tried to find ${this.project.path}). Did you install all npm modules?`);
      return;
    }

    this.loading = true;

    try {
      await this.load();
    } catch (e) {
      this.notification.error(`Error loading JSPM dependencies: ${e.message}`);
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
    let config = await JSPM.getConfig({
      project: this.project
    });

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

    let workingDirectory = FS.getFolderPath(this.project.packageJSONPath);

    // get list of forks
    JSPM.getForks(config, {
      project: this.project,
      jspmOptions: {
        workingDirectory: workingDirectory
      }
    })
    .then(forks => this.forks = forks);
  }

  updateSelected() {
    let deps = this.getSelectedDependencies();
    let installDeps;

    if (deps.length ===  0) {
      this.notification.warning('Please select at least one dependency');
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
    this.install(true, { lock: true }, true);
  }

  install(deps, jspmOptions = {}, withLoader = false) {
    let task = this.common.install(this.project, deps, jspmOptions, withLoader);

    this.taskManager.startTask(task);

    this.dialogService.open({ viewModel: TaskManagerModal, model: { task: task }});
  }

  @withModal(Forks, function () { return { forks: this.forks }; })
  showForks() {}

  goBack() {
    this.main.returnToPluginList();
  }
}
