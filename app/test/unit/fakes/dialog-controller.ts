export class DialogControllerFake {
  ok = jasmine.createSpy('ok');
  cancel = jasmine.createSpy('cancel');
}

export {DialogController} from 'aurelia-dialog';