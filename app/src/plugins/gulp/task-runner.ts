import {autoinject, bindable, computedFrom} from 'aurelia-framework';
import {EventAggregator, Subscription}      from 'aurelia-event-aggregator';
import {Main}                 from '../../main/main';
import {GulpService}          from './gulp-service';
import {RandomNumber}         from '../../shared/random-number';
import {ApplicationState}     from '../../shared/application-state';
import {Notification}         from '../../shared/notification';

@autoinject()
export class TaskRunner {
  @bindable visible = false;
  tasks: Array<GulpTask> = [];
  runningTasks: Array<GulpTask> = [];
  loading: boolean = false;
  errored: boolean = false;
  error: string;
  selectedTask: GulpTask;
  subscription: Subscription;
  _title = 'Gulp';

  @computedFrom('_title')
  get title () {
    return this._title;
  }

  constructor(private main: Main,
              private gulpService: GulpService,
              private state: ApplicationState,
              private notification: Notification,
              private ea: EventAggregator) {}

  async attached() {
    this.subscription = this.ea.subscribe('SelectedProjectChanged', () => {
      this.selectedTask = null;

      if (this.runningTasks.length > 0) {
        let gulptasks = this.runningTasks.map(x => x.name);
        this.notification.warning(`The following gulp tasks were still running: ${gulptasks}. Cancelling them now`);
        this.runningTasks.forEach(task => this.cancel(task));
      }

      if (this.visible) {
        this.loadTasks();
      }
    });
  }

  cancel(task: GulpTask) {
    this.gulpService.cancelTask(task.process);
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
    let tasks: Array<string> = [];

    this.tasks = [];
    if (useCache && project.gulptasks) {
      tasks = project.gulptasks;
    } else {
      try {
        tasks = await this.gulpService.getTasks(project.gulpfile);

        // cache the gulp tasks we have just loaded through gulp --tasks-simple
        // speeds up load times
        project.gulptasks = tasks;

        this.state._save();
      } catch (e) {
        this.errored = true;
        console.log(e);
        this.error = 'Did you install the npm modules?';
      }
    }

    tasks.forEach(task => {
      this.tasks.push(<GulpTask>{
        id: new RandomNumber().create(),
        name: task,
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

  run(task: GulpTask) {
    this.runningTasks.push(task);
    this.updateTitle();

    let result = this.gulpService.runTask(this.main.selectedProject.gulpfile, task.name, stdout => {
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
    this._title = runningTasks > 0 ? `Gulp (${runningTasks})` : 'Gulp';
  }
}

export interface GulpTask {
  id: number,
  name: string;
  running: boolean;
  process: any;
  logs: Array<{ message: string }>;
}