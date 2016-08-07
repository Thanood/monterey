export function configure(aurelia) {
  aurelia.feature('plugins/app-launcher');
  aurelia.feature('plugins/npm');
  aurelia.feature('plugins/jspm');
  aurelia.feature('plugins/aurelia-cli');
  aurelia.feature('plugins/gulp');
  aurelia.feature('plugins/webpack');
  aurelia.feature('plugins/project-info');
  aurelia.feature('plugins/preferences');
  aurelia.feature('plugins/gist-run');
  aurelia.feature('plugins/errors');
  aurelia.feature('plugins/support');
  aurelia.feature('plugins/task-manager');
  aurelia.feature('plugins/about');
}
