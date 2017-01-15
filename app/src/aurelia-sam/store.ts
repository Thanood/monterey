import {autoinject} from 'aurelia-framework';
import {AureliaSamActions, IAureliaSamAction} from './actions';
import {AureliaSamModel} from './model';
import {AureliaSamState} from './state';

@autoinject()
export class AureliaSamStore {
  constructor(private actions: AureliaSamActions, private model: AureliaSamModel, private state: AureliaSamState) {}

  dispatch(action: string, state: any, options?: any) {
    return this.actions.execute(action, state, options);
  }

  getHistory() {
    return this.model.getHistory();
  }

  registerAction(action: IAureliaSamAction) {
    this.actions.register(action);
  }

  registerModel(key: string, model: any) {
    // used to initialize a local model, can be misused
    this.model.register(key, model);
  }

  subscribe(callback: (model: any) => void) {
    return this.state.subscribe(callback);
  }
}
