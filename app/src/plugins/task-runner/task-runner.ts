import {autoinject, bindable, computedFrom} from 'aurelia-framework';
import {EventAggregator, Subscription}      from 'aurelia-event-aggregator';
import {Container}                  from 'aurelia-dependency-injection';
import {Main}                       from '../../main/main';
import {GulpService}                from '../gulp/gulp-service';
import {AureliaCLIService}          from '../aurelia-cli/aurelia-cli-service';
import {WebpackService}             from '../webpack/webpack-service';
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
  _img: string;
  _icon: string;
  service: TaskRunnerService;
  selectedProject: Project;

  @computedFrom('_title')
  get title () {
    return this._title;
  }

  @computedFrom('_img')
  get img () {
    return this._img;
  }

  @computedFrom('_icon')
  get icon () {
    return this._icon;
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
    this.errored = false;
    this.error = null;

    this.selectedProject = this.main.selectedProject;

    if (!this.selectedProject) return;

    this.service = this.getService(this.selectedProject);

    this.updateTaskBar();

    if (this.visible && this.taskRunnerState.tasks.length === 0) {
      this.loadTasks();
    }
  }

  getService(project: Project) {
    if (this.selectedProject.isUsingGulp()) {
      return this.container.get(GulpService);
    } else if (this.selectedProject.isUsingAureliaCLI()) {
      return this.container.get(AureliaCLIService);
    } else if(this.selectedProject.isUsingWebpack()) {
      return this.container.get(WebpackService);
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
    this.loading = true;

    // make sure that node_modules are installed by checking whether or not node_modules folder exists
    if (!(await FS.folderExists(FS.join(FS.getFolderPath(this.selectedProject.packageJSONPath), 'node_modules')))) {
      this.errored = true;
      this.error = 'Did you install the npm modules?';
      this.loading = false;
      return;
    }

    await this._loadTasks(this.selectedProject, this.taskRunnerState, this.service, useCache);

    // select first task
    if (!this.taskRunnerState.selectedTask && this.taskRunnerState.tasks.length > 0) {
      this.taskRunnerState.selectedTask = this.taskRunnerState.tasks[0];
    }

    this.loading = false;
  }

  detached() {
    this.subscription.dispose();
  }

  async _loadTasks(project: Project, taskRunnerState: any, service: TaskRunnerService, useCache = true) {
    taskRunnerState.tasks = [];

    let tasks = await service.getTasks(project, useCache);

    tasks.forEach(task => {
      taskRunnerState.tasks.push(<Task>{
        id: new RandomNumber().create(),
        command: task.command,
        parameters: task.parameters,
        name: `${task.command} ${task.parameters ? task.parameters.join(' ') : ''}`,
        logs: []
      });
    });
  }

  run(task: Task, project?: Project, service?: TaskRunnerService) {
    if (!project) {
      project = this.selectedProject;
    }
    if (!service) {
      service = this.service;
    }

    project.__meta__.taskrunner.runningTasks.push(task);
    this.updateTaskBar();

    let result = service.runTask(project, task, stdout => {
      task.logs.unshift({ message: stdout });
    }, stderr => {
      task.logs.unshift({ message: stderr });
    });
    task.process = result.process;
    result.completion.then(() => {

      // remove task from runningTasks array
      let index = project.__meta__.taskrunner.runningTasks.indexOf(task);
      project.__meta__.taskrunner.runningTasks.splice(index, 1);
      this.updateTaskBar();

      task.running = false;
      task.logs.unshift({ message: 'PROCESS STOPPED' });
    });
    task.running = true;
  }

  clearLog(task: Task) {
    task.logs = [];
  }

  updateTaskBar() {
    let runningTasks = this.taskRunnerState.runningTasks.length;
    let style = this.service.getTaskBarStyle(runningTasks);
    this._title = style.title;
    this._img = style.img;
    this._icon = style.icon;
  }
}


export interface TaskRunnerService {
  getTasks(project: Project, useCache: boolean): Promise<Array<ProjectTask>>;
  runTask(project: Project, task: ProjectTask, stdout, stderr);
  cancelTask(process);
  getTaskBarStyle(runningTasks: number);
}