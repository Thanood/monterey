import {Step} from '../../../src/project-installation/step';
import {Workflow} from '../../../src/project-installation/workflow';
import {Phase} from '../../../src/project-installation/phase';
import '../setup';

describe('Workflow', () => {
  let sut: Workflow;

  beforeEach(() => {
    sut = new Workflow(null, null);
    sut.addPhase(new Phase('dependencies'));
    sut.addPhase(new Phase('environment'));
    sut.addPhase(new Phase('run'));

    sut.getPhase('dependencies').addStep(new Step('npm install', 'npm install', null));
    sut.getPhase('dependencies').addStep(new Step('jspm install', 'jspm install', null));

    sut.getPhase('environment').addStep(new Step('typings install', 'typings install', null));

    sut.getPhase('run').addStep(new Step('gulp watch', 'gulp watch', null));
    sut.getPhase('run').addStep(new Step('dotnet run', 'dotnet run', null));
  });

  it('deselects following phases when a phase gets unchecked', () => {
    sut.getPhase('dependencies').checked = false;

    sut.onCheck(sut.getPhase('dependencies'));

    for(let x = sut.phases.indexOf(sut.getPhase('dependencies')) + 1; x < sut.phases.length; x++) {
      expect(sut.phases[x].checked).toBe(false);

      for(let y = 0; y < sut.phases[x].steps.length; y++) {
        expect(sut.phases[x].steps[y].checked).toBe(false);
      }
    }
  });

  it('deselects following phases when a step gets unchecked', () => {
    // using this to make sure that previous steps are left untouched
    sut.getPhase('dependencies').steps[0].checked = true;

    sut.getPhase('dependencies').steps[1].checked = false;
    sut.onCheck(sut.getPhase('dependencies'), sut.getPhase('dependencies').steps[1]);

    for(let x = sut.phases.indexOf(sut.getPhase('dependencies')) + 1; x < sut.phases.length; x++) {
      expect(sut.phases[x].checked).toBe(false);

      for(let y = 0; y < sut.phases[x].steps.length; y++) {
        expect(sut.phases[x].steps[y].checked).toBe(false);
      }
    }

    expect(sut.getPhase('dependencies').steps[0].checked).toBe(true);
  });

  it('selects previous phases when a phase gets checked', () => {
    // deselect all
    sut.phases.forEach(phase => {
      phase.checked = false;
      phase.steps.forEach(step => step.checked = false);
    });

    sut.getPhase('run').checked = true;
    sut.onCheck(sut.getPhase('run'));

    for(let x = 0; x < sut.phases.indexOf(sut.getPhase('run')); x++) {
      expect(sut.phases[x].checked).toBe(true);

      for(let x = 0; x < sut.phases[x].steps.length; x++) {
        expect(sut.phases[x].steps[x].checked).toBe(true);
      }
    }
  });

  it('deselects next steps in the same phase', () => {
    sut.getPhase('dependencies').steps[0].checked = false;

    sut.onCheck(sut.getPhase('dependencies'), sut.getPhase('dependencies').steps[0]);

    expect(sut.getPhase('dependencies').steps[1].checked).toBe(false);
  });

  it('selects previous steps in the same phase', () => {
    sut.getPhase('dependencies').steps[0].checked = false;
    sut.getPhase('dependencies').steps[1].checked = true;

    sut.onCheck(sut.getPhase('dependencies'), sut.getPhase('dependencies').steps[1]);

    expect(sut.getPhase('dependencies').steps[0].checked).toBe(true);
  });

  it('selects phase if all steps are checked', () => {
    sut.getPhase('dependencies').checked = false;

    sut.getPhase('dependencies').steps[0].checked = true;
    sut.getPhase('dependencies').steps[1].checked = true;

    sut.onCheck(sut.getPhase('dependencies'), sut.getPhase('dependencies').steps[1]);

    expect(sut.getPhase('dependencies').checked).toBe(true);
  });

  it('unselects phase if all steps are unchecked', () => {
    sut.getPhase('dependencies').checked = true;

    sut.getPhase('dependencies').steps.forEach(step => step.checked = false);

    sut.onCheck(sut.getPhase('dependencies'), sut.getPhase('dependencies').steps[0]);

    expect(sut.getPhase('dependencies').checked).toBe(false);
  });

  it('selects/deselects steps in phase when a phase gets selected/deselected', () => {
    sut.getPhase('dependencies').checked = false;

    sut.onCheck(sut.getPhase('dependencies'));

    sut.getPhase('dependencies').steps.forEach(s => expect(s.checked).toBe(false));

    // and check again

    sut.getPhase('dependencies').checked = true;

    sut.onCheck(sut.getPhase('dependencies'));

    sut.getPhase('dependencies').steps.forEach(s => expect(s.checked).toBe(true));    
  });
});