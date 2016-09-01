import {RenameModal}  from '../../../../src/main/components/rename-modal';
import {SelectedProject}  from '../../../../src/shared/selected-project';
import {DialogController} from 'aurelia-dialog';
import {Container}    from 'aurelia-framework';

describe('Project rename', () => {
  let sut: RenameModal;
  let container: Container;
  let selectedProject: SelectedProject;

  beforeEach(() => {
    container = new Container();
    this.selectedProject = {};
    this.dialogController = { ok: jasmine.createSpy('dialog controller ok()') };
    container.registerInstance(SelectedProject, this.selectedProject);
    container.registerInstance(DialogController, this.dialogController);
    sut = container.get(RenameModal);
  });

  it ('uses old project name as default', () => {
    this.selectedProject.current = { name: 'foo' };
    sut.bind();
    expect(sut.newName).toBe('foo');
    expect(sut.oldName).toBe('foo');
  });

  it ('does not change anything when there are validation errors', async (r) => {
    sut.validation.validate = jasmine.createSpy('validate').and.returnValue(['some error']);
    this.selectedProject.current = { name: 'foo' };
    sut.bind();
    
    sut.newName = '';

    await sut.ok();

    expect(this.selectedProject.current.name).toBe('foo');
    r();
  });

  it ('updates name of selected project when everything is OK', async (r) => {
    spyOn(sut.state, '_save').and.returnValue(Promise.resolve());
    sut.validation.validate = jasmine.createSpy('validate').and.returnValue([]);
    this.selectedProject.current = { name: 'foo' };
    sut.bind();
    
    sut.newName = 'bar';

    await sut.ok();

    expect(this.selectedProject.current.name).toBe('bar');
    r();
  });

  it ('saves application state after change', async (r) => {
    spyOn(sut.state, '_save').and.returnValue(Promise.resolve());
    sut.validation.validate = jasmine.createSpy('validate').and.returnValue([]);
    this.selectedProject.current = { name: 'foo' };
    sut.bind();
    
    sut.newName = 'bar';

    await sut.ok();

    expect(sut.state._save).toHaveBeenCalled();
    r();
  });
});