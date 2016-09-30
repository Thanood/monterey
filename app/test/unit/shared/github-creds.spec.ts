import {GithubCreds}  from '../../../src/shared/github-creds';
import {Notification, NotificationFake, DialogController,
  DialogControllerFake, ValidationController, ValidationControllerFake,
  ApplicationState, ApplicationStateFake}  from '../fakes/index';
import {Container} from 'aurelia-framework';

describe('GithubCreds', () => {
  let sut: GithubCreds;
  let container: Container;

  beforeEach(() => {
    container = new Container();
    container.registerSingleton(Notification, NotificationFake);
    container.registerSingleton(DialogController, DialogControllerFake);
    container.registerSingleton(ApplicationState, ApplicationStateFake);
    sut = container.get(GithubCreds);

    sut.validation = new ValidationControllerFake();
  });

  it('warns if there are validation errors', () => {
    let validation = <ValidationControllerFake>sut.validation;
    validation.validate.and.returnValue(['error', 'error']);
    let notification = <Notification>container.get(Notification);

    sut.submit();

    expect(notification.warning).toHaveBeenCalledWith('There are validation errors');
  });

  it('closes dialog if there are no validation errors', () => {
    let dialogController = <DialogController>container.get(DialogController);

    sut.submit();

    expect(dialogController.ok).toHaveBeenCalled();
  });

  it('stores github creds as base64 hash of username:password', () => {
    let state = <ApplicationStateFake>container.get(ApplicationState);

    // base64 of foo:bar is Zm9vOmJhcg==
    sut.username = 'foo';
    sut.password = 'bar';

    sut.submit();

    expect(state.gitAuthorization).toBe('Zm9vOmJhcg==');
  });

  it('saves session', () => {
    let state = <ApplicationStateFake>container.get(ApplicationState);

    sut.username = 'foo';
    sut.password = 'bar';

    sut.submit();

    expect(state._save).toHaveBeenCalled();
  });
});