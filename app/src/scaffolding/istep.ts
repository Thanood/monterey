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
}