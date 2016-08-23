import {DialogService} from 'aurelia-dialog';
import {Container}     from 'aurelia-framework';

/**
* the withModal decorator can decorate a method and will show a modal before the method gets executed
* only when the modal is confirmed (and not cancelled) will the method be called
*/
export function withModal(modalClass, transformer: (param) => any = null, options: any = null) {
  return function(target, key, descriptor) {
    let ptr = descriptor.value;
    descriptor.value = function(...args) {
      let transformed;

      if (transformer) {
        transformed = transformer.apply(this, args);
      }

      let dialogService = Container.instance.get(DialogService);

      return dialogService.open({ viewModel: modalClass, model: transformed, options: options })
      .then(response => {
        if (!response.wasCancelled) {
          return ptr.call(this, response.output);
        }
      });
    };

    return descriptor;
  };
}
