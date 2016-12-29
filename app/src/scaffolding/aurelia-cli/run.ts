import {WorkflowContext} from '../workflow-context';
import {Notification, AURELIACLI, Logger, LogManager, autoinject} from '../../shared/index';

const logger = <Logger>LogManager.getLogger('project-manager');

@autoinject()
export class Run {
  failed = false;
  finished = false;
  state;
  context: WorkflowContext;
  promise: Promise<{}>;

  constructor(private notification: Notification) {
  }

  async activate(model: { context: WorkflowContext }) {
    this.context = model.context;
    this.state = model.context.state;

    this.context.onNext(() => this.next());
    this.context.onPrevious(() => this.previous());
  }

  async attached() {
    this.promise = new Promise(async (resolve, reject) => {
      this.finished = false;
      try {
        logger.info(`creating aurelia-cli project: ${JSON.stringify(this.state)}`);

        let proj =  await AURELIACLI.create(this.state);

        this.finished = true;
        this.state.successful = true;

        this.context.next();

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

  async next() {
    return this.finished;
  }

  async previous() {
    this.notification.warning('This is not possible at this point');
    return false;
  }
}
