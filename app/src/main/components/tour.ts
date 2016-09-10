import {bindable, autoinject} from 'aurelia-framework';
import {ApplicationState}     from '../../shared/application-state';

@autoinject()
export class Tour {

  delay: number = 1000;

  constructor(private state: ApplicationState) {}

  attached() {
    if (this.state.__meta__.firstStart) {
      // delay the tour so that all UI elements are rendered
      setTimeout(() => this.start(), this.delay);
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
        element: $('task-bar .support')[0],
        intro: 'Here you can find ways to contact the developers of Monterey',
        position: 'top-left-aligned',
        heightPadding: 0
      }, {
        element: $('task-bar .taskmanager')[0],
        intro: 'The taskmanager shows everything that Monterey is working on',
        position: 'top-left-aligned',
        heightPadding: 0
      }]
    });
    intro.start();
  }
}