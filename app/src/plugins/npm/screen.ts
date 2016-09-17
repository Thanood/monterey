import {autoinject}       from 'aurelia-framework';
import {DialogService}    from 'aurelia-dialog';
import {NPM}              from 'monterey-pal';
import {TaskManager}      from '../../plugins/task-manager/task-manager';
import {TaskManagerModal} from '../../plugins/task-manager/task-manager-modal';
import {Main}             from '../../main/main';
import {Common}           from './common';
import {Analyzer}         from './analyzer';
import {SelectedProject, Notification}  from '../../shared/index';

@autoinject()
export class Screen {

  projectGrid;
  loading: boolean;
  topLevelDependencies: Array<any> = [];

  constructor(private common: Common,
              private analyzer: Analyzer,
              private taskManager: TaskManager,
              private dialogService: DialogService,
              private notification: Notification,
              private selectedProject: SelectedProject,
              private main: Main) {
  }

  attached() {
    this.load();
  }

  async load() {
    this.loading = true;

    this.topLevelDependencies = await this.analyzer.analyze(this.selectedProject.current);

    let promises = [];

    promises.push(this.analyzer.getLatestVersions(this.topLevelDependencies));
    promises.push(this.analyzer.lookupInstalledVersions(this.selectedProject.current, this.topLevelDependencies));

    Promise.all(promises)
    .then(() => this.topLevelDependencies.forEach(dep => this.analyzer.checkIfUpToDate(dep)))
    .then(() => this.loading = false);
  }

  installAll() {
    let task = this.common.installNPMDependencies(this.selectedProject.current);

    this.taskManager.addTask(this.selectedProject.current, task);

    this.taskManager.startTask(task);

    this.dialogService.open({ viewModel: TaskManagerModal, model: { task: task }});
  }

  updateSelected() {
    // get array of selected dependencies
    // and add @* to the name to let npm ignore major version bumps
    let deps = this.getSelectedDependencies().map(x => x.name + '@*');

    if (deps.length ===  0) {
      this.notification.warning('Please select at least one dependency');
      return;
    }

    let task = this.common.installNPMDependencies(this.selectedProject.current, deps, 'This could take 30 seconds or more to complete');

    this.taskManager.addTask(this.selectedProject.current, task);

    this.taskManager.startTask(task);

    this.dialogService.open({ viewModel: TaskManagerModal, model: { task: task }});
  }

  getSelectedDependencies(): Array<any> {
    let selection = this.projectGrid.ctx.vGridSelection.getSelectedRows();
    return selection.map(index => this.topLevelDependencies[index]);
  }

  goBack() {
    this.main.returnToPluginList();
  }
}
