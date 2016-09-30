import {Workflow} from '../../../src/scaffolding/workflow';
import {ScaffoldProject} from '../../../src/scaffolding/scaffold-project';
import {Settings} from '../../../src/shared/settings';
import {Container} from 'aurelia-framework';

describe('Scaffold project modal', () => {
  let sut: ScaffoldProject;
  let settings;

  beforeEach(() => {
    let container = new Container();
    settings = {
      getValue: jasmine.createSpy('getValue')
    };
    container.registerInstance(Settings, settings);
    sut = container.get(ScaffoldProject);
  });

  it('copies JSON definition so old answers are cleared', () => {
    sut.reset();
    (<any>sut).workflow.steps[0].someProp = 'foo';
    sut.reset();
    expect((<any>sut).workflow.steps[0].someProperty).toBeUndefined();
  });

  it('restores project path from settings', () => {
    settings.getValue = (key) => {
      if (key === 'new-project-folder') {
        return 'c:/my-path';
      }
    };
    sut.reset();

    expect(sut.state.path).toBe('c:/my-path');
  });

  it('assigns state of template to the state of the WorkflowContext', () => {
    sut.selectedTemplate = <any>{
      state: {
        prop: 'foo'
      }
    };
    sut.reset();

    expect(sut.state.prop).toBe('foo');
  });
});