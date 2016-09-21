import {Project} from '../shared/index';

export interface IStep {
  id: number;
  nextActivity?: number;
  type: string;
  stateProperty?: string;
  branches?: Array<any>;
  answer?: string | any;
  state?: any;
  options?: Array<any>;
  viewModel?: string;
}