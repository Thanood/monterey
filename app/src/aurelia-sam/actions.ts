import {autoinject} from 'aurelia-framework';
import {AureliaSamModel} from './model';

export interface IAureliaSamAction {
  intent: { what: string, argument?: any};
  execute(state: any, options?: any): any;
}

@autoinject()
export class AureliaSamActions {
  actions: Map<string, IAureliaSamAction>;

  constructor(private model: AureliaSamModel) {
    this.actions = new Map<string, IAureliaSamAction>();
  }

  execute(action: string, state: any, options?: any) {
    const data = this.actions.get(action).execute(state, options);
    this.model.present(data);
  }

  register(action: IAureliaSamAction) {
    if (!this.actions.has(action.intent.what)) {
      this.actions.set(action.intent.what, action);
    }
  }
}
