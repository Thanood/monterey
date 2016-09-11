import {ApplicationState} from '../shared/application-state';
import {Settings}         from '../shared/settings';

export function configure(aurelia) {
  let settings = aurelia.container.get(Settings);

  settings.addSetting({
    identifier: 'new-project-folder',
    title: 'Default new project folder',
    type: 'string'
  });
}
