import {autoinject, bindable, computedFrom} from 'aurelia-framework';
import {EventAggregator, Subscription}      from 'aurelia-event-aggregator';
import {Container}            from 'aurelia-dependency-injection';
import {Main}                 from '../../main/main';
import {GulpService}          from './gulp-service';
import {AureliaCLIService}    from '../aurelia-cli/aurelia-cli-service';
import {RandomNumber}         from '../../shared/random-number';
import {ApplicationState}     from '../../shared/application-state';
import {Notification}         from '../../shared/notification';
import {Project, ProjectTask} from '../../shared/project';
import {FS}                   from 'monterey-pal';

// the task runner runs tasks for a specific project type
// for aurelia cli this could be 'au run --watch'
// for gulp this could be 'gulp watch'
// for webpack this could be 'npm start'
@autoinject()
export class TaskRunner {
  @bindable visible = false;
  tasks: Array<Task> = [];
  runningTasks: Array<Task> = [];
  loading: boolean = false;
  errored: boolean = false;
  error: string;
  selectedTask: Task;
  subscription: Subscription;
  _title: string;
  service: any;

  @computedFrom('_title')
  get title () {
    return this._title;
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
    let project = this.main.selectedProject;
    this.tasks = [];

    if (project.isUsingGulp()) {
      this.service = this.container.get(GulpService);
    } else if (project.isUsingAureliaCLI()) {
      this.service = this.container.get(AureliaCLIService);
    }

    this.selectedTask = null;

    if (this.runningTasks.length > 0) {
      let tasks = this.runningTasks.map(x => x.name);
      this.notification.warning(`The following tasks were still running: ${tasks}. Cancelling them now`);
      this.runningTasks.forEach(task => this.cancel(task));
    }

    this.updateTitle();

    if (this.visible) {
      this.loadTasks();
    }
  }

  close() {
    this.visible = false;
  }

  visibleChanged(visible) {
    if (visible && this.tasks.length === 0) {
      this.loadTasks();
    }
  }

  async loadTasks(useCache = true) {
    this.errored = false;
    this.error = null;

    this.loading = true;
    let project = this.main.selectedProject;
    let tasks: Array<ProjectTask> = [];

    this.tasks = [];

    // make sure that node_modules are installed by checking whether or not node_modules folder exists
    if (!(await FS.folderExists(FS.join(FS.getFolderPath(project.packageJSONPath), 'node_modules')))) {
      this.errored = true;
      this.error = 'Did you install the npm modules?';
      this.loading = false;
      return;
    }

    if (useCache && project.tasks) {
      tasks = project.tasks;
    } else {
      try {
        tasks = await this.service.getTasks(project);

        // cache tasks, speeds up load times (especially for gulp tasks)
        project.tasks = tasks;

        this.state._save();
      } catch (e) {
        this.errored = true;
        console.log(e);
        this.error = e.message;
        this.loading = false;
      }
    }

    tasks.forEach(task => {
      this.tasks.push(<Task>{
        id: new RandomNumber().create(),
        command: task.command,
        parameters: task.parameters,
        name: `${task.command} ${task.parameters ? task.parameters.join(' ') : ''}`,
        logs: []
      });
    });

    // select first task
    if (!this.selectedTask && this.tasks.length > 0) {
      this.selectedTask = this.tasks[0];
    }

    this.loading = false;
  }

  detached() {
    this.subscription.dispose();
  }

  run(task: Task) {
    this.runningTasks.push(task);
    this.updateTitle();

    let result = this.service.runTask(this.main.selectedProject, task, stdout => {
      task.logs.unshift({ message: stdout });
    }, stderr => {
      task.logs.unshift({ message: stderr });
    });
    task.process = result.process;
    result.completion.then(() => {

      // remove task from runningTasks array
      let index = this.runningTasks.indexOf(task);
      this.runningTasks.splice(index, 1);
      this.updateTitle();

      task.running = false;
      task.logs.unshift({ message: 'PROCESS STOPPED' });
    });
    task.running = true;
  }

  updateTitle() {
    let runningTasks = this.runningTasks.length;
    this._title = this.service.getTaskBarTitle(runningTasks);
  }
}

export interface Task {
  id: number,
  name: string;
  running: boolean;
  process: any;
  command: string;
  parameters: Array<string>;
  logs: Array<{ message: string }>;
}