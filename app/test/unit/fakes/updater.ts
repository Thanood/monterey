export class UpdaterFake {
  checkForUpdate = jasmine.createSpy('checkForUpdate').and.returnValue(Promise.resolve());
  update = jasmine.createSpy('update');
  needUpdate = jasmine.createSpy('needUpdate').and.returnValue(Promise.resolve());
  _getCurrentVersion = jasmine.createSpy('_getCurrentVersion').and.returnValue(Promise.resolve());
}

export * from '../../../src/updater/updater';