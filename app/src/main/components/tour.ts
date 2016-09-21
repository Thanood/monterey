import {ApplicationState, EventAggregator, DialogService, Subscription, bindable, autoinject} from '../../shared/index';

/**
 * This custom element is used to start "tours" (intro.js)
 */
@autoinject()
export class Tour {

  /**
   * The delay allows aurelia to render all UI elements
   * before the tour starts
   */
  delay: number = 1000;
  subscriptions: Array<Subscription> = [];

  constructor(private state: ApplicationState,
              private dialogService: DialogService,
              private ea: EventAggregator) {}

  attached() {
    let dialogControllers = (<any>this.dialogService).controllers;
    let anyDialogsOpen = dialogControllers.length > 0;
    let startedFirstTime = this.state.__meta__.firstStart;

    if (startedFirstTime) {
      if (!anyDialogsOpen) {
        // delay the tour so that all UI elements are rendered
        setTimeout(() => this.start(), this.delay);
      } else {
        this.subscriptions.push(this.ea.subscribeOnce('DialogClosed', () => {
          this.start();
        }));
      }
    }
  }

  start() {
    let intro = introJs();
    intro.setOptions({
      overlayOpacity: 0.5,
      showProgress: true,
      showStepNumbers: false,
      steps: [{
        element: $('.main .main-header')[0],
        intro: 'Welcome to Monterey. Click on next to go through the tour, click on skip to exit the tour',
        position: 'right'
      }, {
        element: $('.main-button-group')[0],
        intro: 'With these buttons you can add, create or remove projects',
        position: 'right'
      }, {
        element: $('.projectList')[0],
        intro: 'This is a list of all your projects',
        position: 'right'
      }, {
        element: $('.tiles-row')[0],
        intro: 'These tiles represent Monterey features that can be used with the selected project',
        position: 'floating'
      }, {
        element: $('task-bar #support')[0],
        intro: 'Here you can find ways to contact the developers of Monterey',
        position: 'top-left-aligned',
        heightPadding: 0
      }, {
        element: $('task-bar #taskmanager')[0],
        intro: 'The taskmanager shows everything that Monterey is working on',
        position: 'top-left-aligned',
        heightPadding: 0
      }]
    });
    intro.start();
  }
}