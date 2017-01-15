import {autoinject} from 'aurelia-framework';
import {IAureliaSamAction} from './actions';
import {AureliaSamState} from './state';

@autoinject()
export class AureliaSamModel {
  history = [];
  model = {};
  constructor(private state: AureliaSamState) { }

  copyModel(model: any) {
    let result = Object.assign({}, model);
    return result;
  }

  getHistory() {
    return this.history;
  }

  normalizeModel(model: any) {
    const ignoredKeys = [
      '__meta__'
    ];
    let normalized;

    if (!!model) {
      if (Array.isArray(model)) {
        normalized = model.map(item => this.normalizeModel(item));
      } else {
        normalized = {};
        Array.from(Object.keys(model)).forEach((key, index) => {
          if (ignoredKeys.indexOf(key) === -1) {
            switch (typeof model[key]) {
              case 'boolean':
              case 'number':
              case 'string':
              case 'undefined':
                normalized[key] = model[key];
                break;
              default:
                normalized[key] = this.normalizeModel(model[key]);
                break;
            }
          }
        });
      }
    } else {
      // typically a value of null
      normalized = model;
    }
    return normalized;
  }

  present(state: any) {
    this.history.push(this.model);
    // transform model into whatever state understands
    // any side-effects (such as http calls) occur here
    this.state.render(this.model);
  }

  register(key: string, model: any) {
    this.model[key] = this.normalizeModel(model);
  }
}
