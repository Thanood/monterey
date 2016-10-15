export class DialogServiceFake {
  open = jasmine.createSpy('open').and.returnValue({ wasCancelled: true });
}

export {DialogService} from 'aurelia-dialog';