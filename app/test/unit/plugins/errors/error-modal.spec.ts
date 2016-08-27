import {ErrorModal} from '../../../../src/plugins/errors/error-modal';
import {Container} from 'aurelia-framework';

describe('Error modal', () => {
  let sut: ErrorModal;
  let container: Container;

  beforeEach(() => {
    container = new Container();
    sut = container.get(ErrorModal);
  });

  it('clears selected error', () => {
    sut.errors.add(new Error('something happened'));
    sut.selectedError = sut.errors.errors[0];
    sut.clearError();
    expect(sut.errors.errors.length).toBe(0);
    expect(sut.selectedError).toBe(undefined);

    // selects first error after delete
    sut.errors.add(new Error('something happened1'));
    sut.errors.add(new Error('something happened2'));
    sut.errors.add(new Error('something happened3'));
    sut.selectedError = sut.errors.errors[2];
    sut.clearError();
    expect(sut.errors.errors.length).toBe(2);
    expect(sut.selectedError).toBe(sut.errors.errors[0]);
  });
});
