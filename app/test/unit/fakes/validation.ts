import {ValidationController} from 'aurelia-validation';

export class ValidationControllerFake implements ValidationController {
  bindings: any;
  renderers: any;
  validateTrigger: any;
  validate = jasmine.createSpy('validate').and.returnValue([]);
  addRenderer = jasmine.createSpy('addRenderer');
  removeRenderer = jasmine.createSpy('removeRenderer');
  registerBinding = jasmine.createSpy('registerBinding');
  unregisterBinding = jasmine.createSpy('unregisterBinding');
  reset = jasmine.createSpy('reset');
}

export {ValidationController} from 'aurelia-validation';