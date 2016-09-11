import {autoinject, bindable}          from 'aurelia-framework';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {I18N}             from 'aurelia-i18n';
import {withModal}        from '../../shared/decorators';
import {SelectedProject}  from '../../shared/selected-project';
import {TaskManager}      from './task-manager';
import {TaskManagerModal} from './task-manager-modal';

@autoinject()
export class TaskBar {
  subscriptions: Array<Subscription> = [];

  running: number = 0;
  queued: number = 0;
  busy: boolean;
  taskManagerText: string;

  constructor(private ea: EventAggregator,
              private taskManager: TaskManager,
              private i18n: I18N,
              private selectedProject: SelectedProject) {
  this.taskManagerText = this.i18n.tr('task-manager');
}

  attached() {
    this.subscriptions.push(this.ea.subscribe('TaskAdded', () => this.propertyChanged()));
    this.subscriptions.push(this.ea.subscribe('TaskStarted', () => this.propertyChanged()));
    this.subscriptions.push(this.ea.subscribe('TaskFinished', (payload) => this.propertyChanged()));
  }

  @withModal(TaskManagerModal, function () { return { project: this.selectedProject.current }; })
  showTasks() {}

  propertyChanged() {
    this.running = this.taskManager.tasks.filter(x => x.status === 'running').length;
    this.queued = this.taskManager.tasks.filter(x => x.status === 'queued').length;

    let text = this.i18n.tr('task-manager');
    let runningTranslation = this.i18n.tr('running');
    let queuedTranslation = this.i18n.tr('queued');

    if (this.running > 0 && this.queued === 0) {
      text = `${text} (${this.running} ${runningTranslation})`;
    } else if (this.queued > 0 && this.running === 0) {
      text = `${text} (${this.queued} ${queuedTranslation})`;
    } else if (this.queued > 0 && this.running > 0) {
      text = `${text} (${this.running} ${runningTranslation}, ${this.queued} ${queuedTranslation})`;
    }

    if (this.running > 0 || this.queued > 0) {
      this.busy = true;
    } else {
      this.busy = false;
    }

    this.taskManagerText = text;
  }

  detached() {
    this.subscriptions.forEach(subscription => subscription.dispose());
  }
}