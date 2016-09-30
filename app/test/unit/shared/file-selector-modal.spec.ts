import {FileSelectorModal}  from '../../../src/shared/file-selector-modal';
import {Notification, NotificationFake, DialogController, DialogControllerFake,
  ValidationController, ValidationControllerFake}  from '../fakes/index';
import {FS} from 'monterey-pal';
import {Container} from 'aurelia-framework';

describe('FileSelectorModal', () => {
  let sut: FileSelectorModal;
  let container: Container;

  beforeEach(() => {
    container = new Container();
    container.registerSingleton(Notification, NotificationFake);
    container.registerSingleton(DialogController, DialogControllerFake);
    sut = container.get(FileSelectorModal);

    sut.validation = new ValidationControllerFake();

    FS.showOpenDialog = jasmine.createSpy('showOpenDialog');
  });

  it('applies default description', () => {
    sut.activate({
      expectedFileName: 'test.js'
    });
    expect(sut.description).toBe('Please locate test.js');
  });

  it('opens file browser', async (r) => {
    sut.activate({
      expectedFileName: 'test.js',
      defaultPath: 'c:/test',
      filters: ['multiple']
    });

    await sut.browser();

    expect(FS.showOpenDialog).toHaveBeenCalledWith({
      title: 'Select test.js',
      properties: ['openFile'],
      defaultPath: 'c:/test',
      filters: ['multiple']
    });
    r();
  });

  it('warns when multiple files have been selected', async (r) => {
    FS.showOpenDialog = jasmine.createSpy('showOpenDialog').and.returnValue(Promise.resolve(['c:/first/test.js', 'c:/second/abcd.js']));
    let notification = <Notification>container.get(Notification);

    sut.activate({
      expectedFileName: 'test.js',
      defaultPath: 'c:/test',
      filters: ['multiple']
    });

    await sut.browser();

    expect(notification.warning).toHaveBeenCalledWith('Please select one test.js file');
    r();
  });

  it('sets selectedFilePath', async (r) => {
    FS.showOpenDialog = jasmine.createSpy('showOpenDialog').and.returnValue(Promise.resolve(['c:/first/test.js']));

    sut.activate({
      expectedFileName: 'test.js',
      defaultPath: 'c:/test',
      filters: ['multiple']
    });

    await sut.browser();

    expect(sut.selectedFilePath).toBe('c:/first/test.js');
    r();
  });

  it('warns if there are validation errors', () => {
    let validation = <ValidationControllerFake>sut.validation;
    validation.validate.and.returnValue(['error', 'error']);
    let notification = <Notification>container.get(Notification);

    sut.ok();

    expect(notification.warning).toHaveBeenCalledWith('There are validation errors');
  });

  it('closes dialog if there are no validation errors', () => {
    let validation = <ValidationControllerFake>sut.validation;
    let dialogController = <DialogController>container.get(DialogController);

    sut.selectedFilePath = 'c:/first/test.js';

    sut.ok();

    expect(dialogController.ok).toHaveBeenCalledWith('c:/first/test.js');
  });
});