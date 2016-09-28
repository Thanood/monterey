import {SelectedProject}  from '../../../src/shared/selected-project';
import {ApplicationState}  from '../../../src/shared/application-state';
import {Container} from 'aurelia-framework';

describe('SelectedProject', () => {
  let sut: SelectedProject;
  let container: Container;
  let state: ApplicationState;

  beforeEach(() => {
    container = new Container();
    state = container.get(ApplicationState);
    sut = container.get(SelectedProject);
  });

  it('notifies observers of project change', () => {
    let notified = false;
    sut.onChange(() => notified = true);

    sut.set(<any>{});

    expect(notified).toBe(true);
  });

  it('unregisters observers of dispose', () => {
    let notified = false;
    let observer = sut.onChange(() => notified = true);

    observer.dispose();

    sut.set(<any>{});

    expect(notified).toBe(false);
  });

  it('sets current project internally', () => {
    sut.set(<any>{name: 'bar'});

    expect(sut.current.name).toBe('bar');
  });

  it('saves current project in state so it can be recovered on monterey startup', () => {
    spyOn(state, '_save');

    sut.set(<any>{name: 'bar', path: 'c:/foo' });
    expect(state.selectedProjectPath).toBe('c:/foo');
    expect(state._save).toHaveBeenCalled();
  });

  it('handles situation where selected project is null', () => {
    sut.set(null);
    expect(state.selectedProjectPath).toBe(null);
  });
});