import {Main} from '../../../main/main';
import {Project, SelectedProject, Settings, LayoutManager, Notification, autoinject, bindable} from '../../../shared/index';

@autoinject()
export class Layout {

  tabs: Element;
  activeTab = 'Global';

 constructor(private layoutManager: LayoutManager,
              private notification: Notification,
              private settings: Settings,
              private main: Main,
              private selectedProject: SelectedProject             
              ) {
  }
  

  attached() {
    $(this.tabs).on('show.bs.tab', (e) => {
      this.activeTab = $(e.target).text();
    });
  }	

 

  async save() {
    this.notification.success('Changes saved');
  }
}