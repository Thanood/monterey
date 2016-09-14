import {Phase} from '../../../../src/plugins/workflow/phase';
import {Step} from '../../../../src/plugins/workflow/step';
import {Task} from '../../../../src/plugins/task-manager/task';

describe('Phase', () => {
  let sut: Phase;

  beforeEach(() => {
    sut = new Phase('some phase', 'some phase that does something');
  });

  it('stores name and description of phase', () => {
    expect(sut.identifier).toBe('some phase');
    expect(sut.description).toBe('some phase that does something');
  });

  it('stepExists works correctly', () => {
    expect(sut.stepExists('this one does not exist')).toBe(false);

    sut.addStep(new Step('npm install', 'npm install', new Task(null)));

    expect(sut.stepExists('npm install')).toBe(true);
    expect(sut.stepExists('jspm install')).toBe(false);
  });

  it('sets the order of steps', () => {
    let step = new Step('npm install', 'npm install', new Task(null));
    sut.addStep(step);
    expect(step.order).toBe(1);

    step = new Step('jspm install', 'jspm install', new Task(null));
    sut.addStep(step);
    expect(step.order).toBe(2);

    step = new Step('gulp watch', 'gulp watch', new Task(null));
    sut.addStep(step);
    expect(step.order).toBe(3);
  });

  it('can move one step after another', () => {
    let jspm = new Step('jspm install', 'jspm install', new Task(null));
    sut.addStep(jspm);

    let npm = new Step('npm install', 'npm install', new Task(null));
    sut.addStep(npm);

    sut.moveAfter(jspm, npm);
    expect(jspm.order > npm.order);
  });

  it('can move one step after another, even when that spot is taken', () => {
    let jspm = new Step('jspm install', 'jspm install', new Task(null));
    sut.addStep(jspm);

    let npm = new Step('npm install', 'npm install', new Task(null));
    sut.addStep(npm);

    let dotnetRestore = new Step('dotnet restore', 'dotnet restore', new Task(null));
    sut.addStep(dotnetRestore);

    let prevOrder = dotnetRestore.order;

    sut.moveAfter(jspm, npm);
    expect(jspm.order - npm.order).toBe(1);

    // the order of all steps after npm install were incremented
    expect(dotnetRestore.order - prevOrder ).toBe(1);
  });
});