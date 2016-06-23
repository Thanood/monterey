export class App {
  configureRouter(config, router) {
    config.title = 'Monterey';
    config.map([
      { route: ['', 'landing'], name: 'landing', moduleId: './landing' }
    ]);

    this.router = router;
  }
}
