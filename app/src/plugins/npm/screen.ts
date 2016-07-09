import {autoinject}       from 'aurelia-framework';
import {Common}           from './common';
import {DialogService}    from 'aurelia-dialog';
import {FS}               from 'monterey-pal';
import {TaskManager}      from '../../task-manager/task-manager';
import {TaskManagerModal} from '../../task-manager/task-manager-modal';

@autoinject()
export class Screen {

  model;
  project;
  topLevelDependencies: Array<any> = [];

  constructor(private common: Common,
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
    // let a = (<any>window).require;
    // var npm = a('npm');
    // await npm.load({ workingDirectory: this.project.path }, done => {
    //   var npmLs = a('npm/lib/ls.js');
    //   npmLs([], false, function (e) { console.log('RESPONSE:', e); });
    // });

    let packageJSON = JSON.parse(await FS.readFile(this.project.packageJSONPath));
    let deps = Object.assign({}, packageJSON.dependencies, packageJSON.devDependencies);

    // normalize data for the grid
    let keys = Object.keys(deps);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let dep = deps[key];
      deps[key] = {
        name: key,
        version: deps[key]
      };

      this.topLevelDependencies.push(deps[key]);
    }
  }

  installAll() {
    let task = this.common.installNPMDependencies(this.project);

    this.dialogService.open({ viewModel: TaskManagerModal, model: { task: task }});
  }
}
