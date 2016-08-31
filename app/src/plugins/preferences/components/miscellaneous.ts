import {autoinject}        from 'aurelia-framework';
import {EventAggregator}   from 'aurelia-event-aggregator';
import {Settings, Setting} from '../../../shared/settings';
import {ApplicationState}  from '../../../shared/application-state';
import {Notification}      from '../../../shared/notification';

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

    await this.state._save();

    this.notification.success('Changes saved');
    this.ea.publish('SettingsChanged');


    this.loading = false;
  }
}