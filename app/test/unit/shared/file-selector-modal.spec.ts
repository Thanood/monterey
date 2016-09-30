import {FileSelectorModal}  from '../../../src/shared/file-selector-modal';
import {Notification}  from '../../../src/shared/notification';
import {ValidationController} from 'aurelia-validation';
import {DialogController} from 'aurelia-dialog';
import {FS} from 'monterey-pal';
import {Container} from 'aurelia-framework';

describe('FileSelectorModal', () => {
  let sut: FileSelectorModal;
  let container: Container;
  let notification: Notification;
  let validation: ValidationController;
  let dialogController: DialogController;

  beforeEach(() => {
    container = new Container();
    notification = <any>{
      warning: jasmine.createSpy('warning')
    };
    validation = <any>{
      validate: jasmine.createSpy('validate')
    };
    dialogController = <any> {
      ok: jasmine.createSpy('ok')
    };
    container.registerInstance(Notification, notification);
    container.registerInstance(DialogController, dialogController);
    sut = container.get(FileSelectorModal);

    sut.validation = validation;

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
    let spy = <jasmine.Spy>validation.validate;
    spy.and.returnValue(['error', 'error']);

    sut.ok();

    expect(notification.warning).toHaveBeenCalledWith('There are validation errors');
  });

  it('closes dialog if there are no validation errors', () => {
    let spy = <jasmine.Spy>validation.validate;
    spy.and.returnValue([]);

    sut.selectedFilePath = 'c:/first/test.js';

    sut.ok();

    expect(dialogController.ok).toHaveBeenCalledWith('c:/first/test.js');
  });
});