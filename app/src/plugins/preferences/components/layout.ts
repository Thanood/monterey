import {Settings, LayoutManager, Notification, autoinject, bindable} from '../../../shared/index';

@autoinject()
export class Layout {
  //@bindable selectedLayout;

  constructor(private layoutManager: LayoutManager,
              private notification: Notification,
              private settings: Settings) {
    //this.selectedLayout = settings.getValue('layout');
  }

  selectedThemeChanged(newVal, oldVal) {
    if (newVal) {
      //this.layoutManager.load(this.selectedLayout);
    }
  }

  async save() {
    //await this.settings.setValue('theme', this.selectedLayout);
    //await this.settings.save();

    this.notification.success('Changes saved');
  }
}