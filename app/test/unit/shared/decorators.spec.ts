import {withModal}  from '../../../src/shared/decorators';
import {Container} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import '../setup';

describe('withModal', () => {

  let dialogService: DialogService;

  beforeEach(() => {
    Container.instance = new Container();
    dialogService = Container.instance.get(DialogService);
  });

  it('calls open on DialogService', () => {
    spyOn(dialogService, 'open').and.returnValue(Promise.resolve());

    class Target {}

    let descriptor = withModal(Target)(null, null, { value: null });
    descriptor.value();

    expect(dialogService.open).toHaveBeenCalledWith({ viewModel: Target, model: undefined, options: null });
  });

  it('calls transformer function', () => {
    spyOn(dialogService, 'open').and.returnValue(Promise.resolve());
    let spy = jasmine.createSpy('transformer');

    class Target {}

    let args = {
      foo: 'bar'
    };

    let descriptor = withModal(Target, spy)(null, null, { value: null });
    descriptor.value(args);

    expect(spy).toHaveBeenCalledWith(args);
  });

  it('calls decorated function only when modal was not cancelled', async (r) => {
    spyOn(dialogService, 'open').and.returnValue(Promise.resolve({ wasCancelled: false }));

    class Target {}

    let called = false;
    let descriptorValue = () => { called = true; };
    let descriptor = withModal(Target)(null, null, { value: descriptorValue });
    await descriptor.value();

    expect(called).toBe(true);
    r();
  });

  it('does not call decorated function when modal was cancelled', async (r) => {
    spyOn(dialogService, 'open').and.returnValue(Promise.resolve({ wasCancelled: true }));

    class Target {}

    let called = false;
    let descriptorValue = () => { called = true; };
    let descriptor = withModal(Target)(null, null, { value: descriptorValue });
    await descriptor.value();

    expect(called).toBe(false);
    r();
  });
});