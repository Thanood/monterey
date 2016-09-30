import {GithubCreds}  from '../../../src/shared/github-creds';
import {Notification}  from '../../../src/shared/notification';
import {ApplicationState}  from '../../../src/shared/application-state';
import {ValidationController} from 'aurelia-validation';
import {DialogController} from 'aurelia-dialog';
import {Container} from 'aurelia-framework';

describe('GithubCreds', () => {
  let sut: GithubCreds;
  let container: Container;
  let notification: Notification;
  let validation: ValidationController;
  let dialogController: DialogController;
  let state: ApplicationState;

  beforeEach(() => {
    container = new Container();
    notification = <any>{
      warning: jasmine.createSpy('warning')
    };
    validation = <any>{
      validate: jasmine.createSpy('validate').and.returnValue([])
    };
    dialogController = <any> {
      ok: jasmine.createSpy('ok')
    };
    state = <any>{
      _save: jasmine.createSpy('_save')
    };
    container.registerInstance(ApplicationState, state);
    container.registerInstance(Notification, notification);
    container.registerInstance(DialogController, dialogController);
    sut = container.get(GithubCreds);

    sut.validation = validation;
  });

  it('warns if there are validation errors', () => {
    let spy = <jasmine.Spy>validation.validate;
    spy.and.returnValue(['error', 'error']);

    sut.submit();

    expect(notification.warning).toHaveBeenCalledWith('There are validation errors');
  });

  it('closes dialog if there are no validation errors', () => {
    let spy = <jasmine.Spy>validation.validate;
    spy.and.returnValue([]);

    sut.submit();

    expect(dialogController.ok).toHaveBeenCalled();
  });

  it('stores github creds as base64 hash of username:password', () => {

    // base64 of foo:bar is Zm9vOmJhcg==
    sut.username = 'foo';
    sut.password = 'bar';

    sut.submit();

    expect(state.gitAuthorization).toBe('Zm9vOmJhcg==');
  });

  it('saves session', () => {
    sut.username = 'foo';
    sut.password = 'bar';

    sut.submit();

    expect(state._save).toHaveBeenCalled();
  });
});