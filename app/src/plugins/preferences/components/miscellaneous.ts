import {Settings, Setting, ApplicationState, Notification, autoinject, EventAggregator} from '../../../shared/index';

@autoinject()
export class Miscellaneous {
  loading: boolean;
  _settings: Array<Setting> = [];

  constructor(private settings: Settings,
              private state: ApplicationState,
              private notification: Notification,
              private ea: EventAggregator) {
    this._settings = settings.getSettings();
  }

  async save() {
    this.loading = true;

    await this.settings.save();

    this.notification.success('Changes saved');
    this.ea.publish('SettingsChanged');


    this.loading = false;
  }
}