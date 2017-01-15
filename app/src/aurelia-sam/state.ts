import {Disposable} from 'aurelia-framework';

export class AureliaSamState {
  subscribers: Set<(model: any) => void>;

  constructor() {
    this.subscribers = new Set<(model: any) => void>();
  }

  render(model: any) {
    this.subscribers.forEach(sub => sub(model));
  }

  subscribe(callback: (model: any) => void): Disposable {
    this.subscribers.add(callback);
    return {
      dispose: () => {
        this.subscribers.delete(callback);
      }
    };
  }
}
