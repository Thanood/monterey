import {ApplicationState, Settings} from '../shared/index';

export function configure(aurelia) {
  let settings = aurelia.container.get(Settings);

  settings.addSetting({
    identifier: 'new-project-folder',
    title: 'Default new project folder',
    type: 'string'
  });
}
