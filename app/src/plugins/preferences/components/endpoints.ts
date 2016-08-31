import {ManageEndpoints}      from '../../../shared/manage-endpoints';
import {withModal}            from '../../../shared/decorators';

export class Endpoints {
  @withModal(ManageEndpoints)
  async manageEndpoints() {}
}