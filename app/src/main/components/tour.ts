export class Tour {

  delay: number = 1000;

  attached() {
    setTimeout(() => this.start(), this.delay);
  }

  start() {
    let intro = introJs();
    intro.setOptions({ 
      overlayOpacity: 0.5,
      showStepNumbers: false,
      steps: [{
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