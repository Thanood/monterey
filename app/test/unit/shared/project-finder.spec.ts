import {Container}      from 'aurelia-framework';
import {ProjectFinder}  from '../../../src/shared/project-finder';
import {ProjectManager} from '../../../src/shared/project-manager';
import {FS}             from 'monterey-pal';

describe('ProjectFinder', () => {
  let sut: ProjectFinder;
  let container: Container;
  let projectManager: ProjectManager;

  beforeEach(() => {
    container = new Container();
    this.projectManager = { addProjectByPath: jasmine.createSpy('addProjectByPath') };
    container.registerInstance(ProjectManager, this.projectManager);
    sut = container.get(ProjectFinder);
  });

  it('adds all projects to project manager', async (r) => {
    FS.showOpenDialog = jasmine.createSpy('showOpenDialog').and.returnValue(['a', 'b']);
    await sut.openDialog();

    expect(this.projectManager.addProjectByPath).toHaveBeenCalledWith('a');
    expect(this.projectManager.addProjectByPath).toHaveBeenCalledWith('b');
    r();
  });

  it('returns array of projects or booleans', async (r) => {
    FS.showOpenDialog = jasmine.createSpy('showOpenDialog').and.returnValue(['a', 'b']);
    this.projectManager.addProjectByPath = async (p): Promise<any> => {
      if (p === 'a') return { name: 'foo' };
      if (p === 'b') return false;
    };

    let result = await sut.openDialog();

    expect(result[0].name).toBe('foo');
    expect(result[1]).toBe(false);
    r();
  });

  it('returns false if no projects were selected', async (r) => {
    FS.showOpenDialog = jasmine.createSpy('showOpenDialog').and.returnValue(null);
    this.projectManager.addProjectByPath = async (p): Promise<any> => {};

    let result = await sut.openDialog();

    expect(result).toBe(false);
    r();
  });
});