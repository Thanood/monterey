import {DialogService} from 'aurelia-dialog';
import {Container}     from 'aurelia-dependency-injection';

export function withModal(modalClass, transformer = null) {
  return function(target, key, descriptor) {
    let ptr = descriptor.value;
    descriptor.value = function(...args) {
      let transformed;

      if (transformer) {
        transformed = transformer.apply(this, args);
      }

      let dialogService = Container.instance.get(DialogService);

      return dialogService.open({ viewModel: modalClass, model: transformed })
      .then(response => {
        if (!response.wasCancelled) {
          return ptr.call(this, response.output);
        }
      });
    };

    return descriptor;
  };
}
