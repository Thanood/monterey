import {autoinject}       from 'aurelia-framework';
import {JSPM, FS}         from 'monterey-pal';
import {DialogService}    from 'aurelia-dialog';
import {TaskManager}      from '../../shared/task-manager';
import {TaskManagerModal} from '../../main/components/task-manager-modal';
import {Analyzer}         from './analyzer';

@autoinject()
export class Screen {

  lock = false;
  model;
  project;
  a;
  jspm;
  config;
  process;
  loader;
  topLevelDependencies = [];
  allDependencies = [];

  constructor(private taskManager: TaskManager,
              private analyzer: Analyzer,
              private dialogService: DialogService) {
  }

  async activate(model) {
    this.model = model;
    this.project = model.selectedProject;

    // this is a hack (obviously)
    // needs to be improved and moved to pal
    let packageJSON = JSON.parse(await FS.readFile(this.project.packageJSONPath));
    (<any>window)._this = this;
    this.a = (<any>window).require;
    let system = (<any>window).System;
    this.jspm = this.a('jspm');
    this.config = this.a('jspm/lib/config.js');
    this.install = this.a('jspm/lib/install.js');
    this.process = (<any>window).process;
    (<any>window).System = system;
    let originalWorkingDirectory = this.process.cwd();
    this.process.chdir(this.project.path );

    this.jspm.setPackagePath(this.project.packageJSONPath);
    await this.config.load();

    this.allDependencies = this.analyzer.analyze(this.config.loader, packageJSON);
    this.topLevelDependencies =  this.allDependencies
      .filter(i => i.isTopLevel)
      .sort((a, b) => {
        if (a.package < b.package) return -1;
        if (a.package > b.package) return 1;
        return 0;
      });
  }

  install() {
    let task = <any>{
      title: `jspm install of '${this.project.name}'`,
      estimation: 'This usually takes about a minute to complete',
      logs: []
    };

    let workingDirectory = FS.getFolderPath(this.project.packageJSONPath);

    let promise = JSPM.install([], {
      jspmOptions: {
        workingDirectory: workingDirectory,
        lock: this.lock
      },
      logCallback: (message) => {
        this.taskManager.addTaskLog(task, message.message);
      }
    })
    .then(() => JSPM.downloadLoader({
      jspmOptions: {
        workingDirectory: workingDirectory
      },
      logCallback: (message) => {
        this.taskManager.addTaskLog(task, message.message);
      }
    }));

    task.promise = promise;

    this.taskManager.addTask(task);

    this.dialogService.open({ viewModel: TaskManagerModal, model: { task: task }});
  }
}
