import {WorkflowCreator} from '../../../../src/plugins/task-manager/workflow-creator';
import {Command}         from '../../../../src/plugins/task-manager/command';
import {Container}       from 'aurelia-framework';

describe('Workflow creator tree formatter', () => {
  let sut: WorkflowCreator;

  beforeEach(() => {
    let container = new Container();
    sut = container.get(WorkflowCreator);
  });

  it('uses the name of the tree if there is no command', () => {
    let output = sut.formatTree(null, [], <any>{
      name: 'Run',
      children: []
    });

    expect(output[0].text).toBe('Run');
    expect(output[0].children.length).toBe(0);
  });

  it ('properly formats child nodes', () => {
    let output = sut.formatTree(null, [], <any>{
      name: 'Run',
      children: [{
        command: {
          command: 'gulp',
          args: ['watch']
        }
      }]
    });

    expect(output[0].children.length).toBe(1);
  });

  it('properly formats 3nd level nodes', () => {
    let output = sut.formatTree(null, [], <any>{
      name: 'Run',
      children: [{
        command: {
          command: 'gulp',
          args: ['watch']
        },
        children: [{
          command: {
            command: 'dotnet',
            args: ['run']
          },
        }]
      }]
    });

    expect(output[0].children[0].children.length).toBe(1);
  });
});

describe('Workflow creator', () => {
  let sut: WorkflowCreator;

  beforeEach(() => {
    let container = new Container();
    sut = container.get(WorkflowCreator);
  });

  it('getTreeWithId returns falsy value if not found', () => {
    expect(sut.getTreeWithId(8052525)).toBeFalsy();

    sut.tree = <any>{
      id: 93838383,
      children: []
    };

    expect(sut.getTreeWithId(8052525)).toBeFalsy();
  });

  it('getTreeWithId finds first level tree', () => {
    sut.tree = <any>{
      id: 8052525,
      children: []
    };

    expect(sut.getTreeWithId(8052525)).toBe(sut.tree);
  });

  it('getTreeWithId finds second+ level tree', () => {
    sut.tree = <any>{
      id: 123456,
      children: [{
        id: 23456,
        children: [{
          id: 34567
        }]
      }]
    };

    expect(sut.getTreeWithId(23456)).toBe(sut.tree.children[0]);
    expect(sut.getTreeWithId(34567)).toBe(sut.tree.children[0].children[0]);
  });

  it('getParent first level parent returns undefined', () => {
    sut.tree = <any> {
      id: 1234,
      children: []
    };
    expect(sut.getParent(sut.tree)).toBeUndefined();
  });

  it('getParent second level', () => {
    sut.tree = <any> {
      id: 1234,
      children: [{
        id: 2345
      }]
    };
    expect(sut.getParent(sut.tree.children[0])).toBe(sut.tree);
  });

  it('getParent third level', () => {
    sut.tree = <any> {
      id: 1234,
      children: [{
        id: 2345,
        children: [{
          id: 3456
        }]
      }]
    };
    expect(sut.getParent(sut.tree.children[0].children[0])).toBe(sut.tree.children[0]);
  });
});