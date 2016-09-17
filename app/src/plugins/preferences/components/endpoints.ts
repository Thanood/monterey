import {ManageEndpoints} from '../../../shared/manage-endpoints';
import {withModal}       from '../../../shared/index';

export class Endpoints {
  @withModal(ManageEndpoints)
  async manageEndpoints() {}
}