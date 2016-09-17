import {TaskManagerModal} from './task-manager-modal';
import {TaskManager}      from './task-manager';
import {withModal, SelectedProject, EventAggregator, Subscription, autoinject, bindable, useView, I18N} from '../../shared/index';

@useView('../task-bar/default-item.html')
@autoinject()
export class TaskBar {
  subscriptions: Array<Subscription> = [];

  running: number = 0;
  queued: number = 0;
  busy: boolean;

  text: string;
  tooltip = 'tooltip-taskmanager';
  icon = 'glyphicon glyphicon-cog';

  constructor(private ea: EventAggregator,
              private taskManager: TaskManager,
              private i18n: I18N,
              private selectedProject: SelectedProject) {
    this.text = this.i18n.tr('task-manager');
  }

  attached() {
    this.subscriptions.push(this.ea.subscribe('TaskAdded', () => this.propertyChanged()));
    this.subscriptions.push(this.ea.subscribe('TaskStarted', () => this.propertyChanged()));
    this.subscriptions.push(this.ea.subscribe('TaskFinished', (payload) => this.propertyChanged()));
  }

  @withModal(TaskManagerModal, function () { return { project: this.selectedProject.current }; })
  onClick() {
    this.ea.publish('RefreshTiles');
  }

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

    this.text = text;
    this.icon = this.busy ? 'glyphicon glyphicon-cog gly-spin' : 'glyphicon glyphicon-cog';
  }

  detached() {
    this.subscriptions.forEach(subscription => subscription.dispose());
  }
}