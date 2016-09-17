import {Project} from '../shared/index';

export interface IStep {
  id: number;
  nextActivity: number;
  type: string;
  previous?: () => Promise<{ goToPreviousStep: boolean }>;
  execute?: () => Promise<{ goToNextStep: boolean }>;
  stateProperty?: string;
  branches?: Array<any>;
  answer: string | any;
  state?: any;
  next: () => void;
  options?: Array<any>;

  // post-create creates the project and uses
  // this property to pass the created project to the modal
  // which returns the project when the modal is closed
  project?: Project;

  closeBtnText: string;
}