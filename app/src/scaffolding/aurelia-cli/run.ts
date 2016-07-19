import {LogManager, autoinject}   from 'aurelia-framework';
import {AURELIACLI}               from 'monterey-pal';
import {IStep}                    from '../istep';
import {Notification}             from '../../shared/notification';

const logger = LogManager.getLogger('project-manager');

@autoinject()
export class Run {
  failed = false;
  finished = false;
  model;
  state;
  step: IStep;
  promise: Promise<void>;

  constructor(private notification: Notification) {
  }

  async activate(model) {
    this.model = model;
    this.state = model.state;
    this.step = model.step;
    this.step.execute = () => this.execute();
    this.step.previous = () => this.previous();
  }

  async attached() {
    this.promise = new Promise(async (resolve, reject) => {
      this.finished = false;
      try {
        // aurelia cli can't handle circular structures so we remove the
        // workflow from the state we set in activities.js

        this.state.workflow = null;

        await AURELIACLI.create(this.state);
        this.finished = true;
        this.state.successful = true;
        resolve();
      } catch (e) {
        this.notification.error('Error while scaffolding the application: ' + e.message);
        logger.error(e);
        this.failed = true;
        this.state.successful = false;
        reject();
      }
    });
  }

  async execute() {
    return {
      goToNextStep: this.finished
    };
  }

  async previous() {
    this.notification.warning('This is not possible at this point');
    return {
      goToPreviousStep: true
    };
  }
}
