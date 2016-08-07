import {autoinject, bindable, computedFrom} from 'aurelia-framework';
import {EventAggregator, Subscription}      from 'aurelia-event-aggregator';
import {Container}                  from 'aurelia-dependency-injection';
import {Main}                       from '../../main/main';
import {GulpService}                from '../gulp/gulp-service';
import {AureliaCLIService}          from '../aurelia-cli/aurelia-cli-service';
import {RandomNumber}               from '../../shared/random-number';
import {ApplicationState}           from '../../shared/application-state';
import {Notification}               from '../../shared/notification';
import {Project, ProjectTask, Task} from '../../shared/project';
import {FS}                         from 'monterey-pal';

// the task runner runs tasks for a specific project type
// for aurelia cli this could be 'au run --watch'
// for gulp this could be 'gulp watch'
// for webpack this could be 'npm start'
@autoinject()
export class TaskRunner {
  @bindable visible = false;
  loading: boolean = false;
  errored: boolean = false;
  error: string;
  subscription: Subscription;
  _title: string;
  service: any;
  selectedProject: Project;

  @computedFrom('_title')
  get title () {
    return this._title;
  }

  get taskRunnerState() {
    if (!this.selectedProject) return;

    if (!this.selectedProject.__meta__) {
      this.selectedProject.__meta__ = {
        taskrunner: {
          runningTasks: [],
          tasks: []
        }
      };
    }
    return this.selectedProject.__meta__.taskrunner;
  }

  constructor(private main: Main,
              private state: ApplicationState,
              private notification: Notification,
              private container: Container,
              private ea: EventAggregator) {
  }

  async attached() {
    this.subscription = this.ea.subscribe('SelectedProjectChanged', () => {
      this.selectedProjectChanged();
    });
    this.selectedProjectChanged();
  }

  cancel(task: Task) {
    this.service.cancelTask(task.process);
  }

  selectedProjectChanged() {
    this.selectedProject = this.main.selectedProject;
    // this.taskRunnerState.tasks = [];

    if (!this.selectedProject) return;

    if (this.selectedProject.isUsingGulp()) {
      this.service = this.container.get(GulpService);
    } else if (this.selectedProject.isUsingAureliaCLI()) {
      this.service = this.container.get(AureliaCLIService);
    }

    // this.taskRunnerState.selectedTask = null;

    // if (this.taskRunnerState.runningTasks.length > 0) {
    //   let tasks = this.taskRunnerState.map(x => x.name);
    //   this.notification.warning(`The following tasks were still running: ${tasks}. Cancelling them now`);
    //   this.taskRunnerState.forEach(task => this.cancel(task));
    // }

    this.updateTitle();

    if (this.visible && this.taskRunnerState.tasks.length === 0) {
      this.loadTasks();
    }
  }

  close() {
    this.visible = false;
  }

  visibleChanged(visible) {
    if (this.selectedProject) {
      if (visible && this.taskRunnerState.tasks.length === 0) {
        this.loadTasks();
      }
    }
  }

  async loadTasks(useCache = true) {
    this.errored = false;
    this.error = null;

    this.loading = true;
    this.taskRunnerState.tasks = [];

    // make sure that node_modules are installed by checking whether or not node_modules folder exists
    if (!(await FS.folderExists(FS.join(FS.getFolderPath(this.selectedProject.packageJSONPath), 'node_modules')))) {
      this.errored = true;
      this.error = 'Did you install the npm modules?';
      this.loading = false;
      return;
    }

    let tasks = await this.service.getTasks(this.selectedProject, useCache);

    tasks.forEach(task => {
      this.taskRunnerState.tasks.push(<Task>{
        id: new RandomNumber().create(),
        command: task.command,
        parameters: task.parameters,
        name: `${task.command} ${task.parameters ? task.parameters.join(' ') : ''}`,
        logs: []
      });
    });

    // select first task
    if (!this.taskRunnerState.selectedTask && this.taskRunnerState.tasks.length > 0) {
      this.taskRunnerState.selectedTask = this.taskRunnerState.tasks[0];
    }

    this.loading = false;
  }

  detached() {
    this.subscription.dispose();
  }

  run(task: Task) {
    this.taskRunnerState.runningTasks.push(task);
    this.updateTitle();

    let result = this.service.runTask(this.selectedProject, task, stdout => {
      task.logs.unshift({ message: stdout });
    }, stderr => {
      task.logs.unshift({ message: stderr });
    });
    task.process = result.process;
    result.completion.then(() => {

      // remove task from runningTasks array
      let index = this.taskRunnerState.runningTasks.indexOf(task);
      this.taskRunnerState.runningTasks.splice(index, 1);
      this.updateTitle();

      task.running = false;
      task.logs.unshift({ message: 'PROCESS STOPPED' });
    });
    task.running = true;
  }

  clearLog(task: Task) {
    task.logs = [];
  }

  updateTitle() {
    let runningTasks = this.taskRunnerState.runningTasks.length;
    this._title = this.service.getTaskBarTitle(runningTasks);
  }
}