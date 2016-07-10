import {autoinject}       from 'aurelia-framework';
import {Common}           from './common';
import {DialogService}    from 'aurelia-dialog';
import {Analyzer}         from './analyzer';
import {TaskManager}      from '../../task-manager/task-manager';
import {TaskManagerModal} from '../../task-manager/task-manager-modal';

@autoinject()
export class Screen {

  model;
  project;
  loading: boolean;
  topLevelDependencies: Array<any> = [];

  constructor(private common: Common,
              private analyzer: Analyzer,
              private dialogService: DialogService) {
  }

  activate(model) {
    this.model = model;
    this.project = model.selectedProject;
  }

  attached() {
    this.load();
  }

  async load() {
    this.loading = true;

    this.topLevelDependencies = await this.analyzer.analyze(this.project);

    let promises = [];

    promises.push(this.analyzer.getLatestVersions(this.topLevelDependencies));
    promises.push(this.analyzer.lookupInstalledVersions(this.project, this.topLevelDependencies));

    Promise.all(promises)
    .then(() => this.topLevelDependencies.forEach(dep => this.analyzer.checkIfUpToDate(dep)))
    .then(() => this.loading = false);
  }

  installAll() {
    let task = this.common.installNPMDependencies(this.project);

    this.dialogService.open({ viewModel: TaskManagerModal, model: { task: task }});
  }
}
