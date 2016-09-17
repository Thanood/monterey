import {GithubCreds} from '../../../shared/github-creds';
import {ApplicationState, withModal, Notification, autoinject, EventAggregator} from '../../../shared/index';

@autoinject()
export class Github {
  loading: boolean;

  constructor(private state: ApplicationState,
              private notification: Notification,
              private ea: EventAggregator) {
  }

  clearGithub() {
    this.state.gitAuthorization = null;
  }

  @withModal(GithubCreds)
  async configureGithub() {}

  async save() {
    this.loading = true;

    await this.state._save();

    this.notification.success('Changes saved');
    this.ea.publish('SettingsChanged');

    this.loading = false;
  }
}