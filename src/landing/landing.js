import {withModal}       from '../shared/decorators';
import {ScaffoldProject} from '../scaffolding/scaffold-project';

export class Landing {
  open() {
    alert('open');
  }

  @withModal(ScaffoldProject)
  create() {}
}
