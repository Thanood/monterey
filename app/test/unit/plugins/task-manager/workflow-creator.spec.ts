import {WorkflowCreator} from '../../../../src/plugins/task-manager/workflow-creator';
import {Command}         from '../../../../src/plugins/task-manager/command';
import {CommandTree}     from '../../../../src/plugins/workflow/command-tree';
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

  it('rebuildWorkflow rebuilds workflow correctly', () => {
    sut.tree = <any>{ name: 'foo', children: [] };

    let cmd = { command: { command: 'a', args: [] }, children: []};
    let cmd2 = { command: { command: 'ab', args: [] }, children: []};
    let cmd3 = { command: { command: 'ac', args: [] }, children: []};
    let cmd4 = { command: { command: 'cd', args: [] }, children: []};
    sut.nodes = [<any>cmd, <any>cmd2, <any>cmd3, <any>cmd4];
    let treeNodes = [{
      a_attr: {
        index: 0
      },
      children: [{
        a_attr: {
          index: 1
        }
      }, {
        a_attr: {
          index: 2
        },
        children: [{
          a_attr: {
            index: 3
          }
        }]
      }]
    }];
    sut.jsTree = <any>{ get_json: jasmine.createSpy('get_json').and.returnValue(treeNodes) };

    let response = sut.rebuildWorkflow();

    expect(response.children.length).toBe(2);
    expect(response.name).toBe('foo');
    expect(response.children[0].children.length).toBe(0);
    expect(response.children[1].children.length).toBe(1);
  });

  it('addCommand adds command to top level node if no treenode has been selected', () => {
    sut.tree = new CommandTree({});
    spyOn(sut, 'getSelectedTree').and.returnValue(undefined);
    spyOn(sut, 'refreshTree');
    sut.addCommand();

    expect(sut.tree.children.length).toBe(1);
    expect(sut.tree.children[0].command.command).toBe('command');
    expect(sut.tree.children[0].command.args[0]).toBe('parameters');
  });

  it('addCommand adds command to selected node', () => {
    let target = new CommandTree({});
    sut.tree = new CommandTree({
      children: [target]
    });
    spyOn(sut, 'getSelectedTree').and.returnValue(target);
    spyOn(sut, 'refreshTree');
    sut.addCommand();

    expect(target.children.length).toBe(1);
    expect(target.children[0].command.command).toBe('command');
    expect(target.children[0].command.args[0]).toBe('parameters');
  });

  it('addCommand refreshes tree', () => {
    sut.tree = new CommandTree({});
    spyOn(sut, 'getSelectedTree').and.returnValue(undefined);
    let refreshSpy = spyOn(sut, 'refreshTree');
    sut.addCommand();

    expect(refreshSpy).toHaveBeenCalled();
  });

  it('removeCommand refreshes tree', () => {
    let child = new CommandTree({});
    let parent = new CommandTree({ children: [child] });
    sut.tree = new CommandTree({
      children: [parent]
    });
    spyOn(sut, 'getSelectedTree').and.returnValue(child);
    spyOn(sut, 'getParent').and.returnValue(parent);
    let refreshSpy = spyOn(sut, 'refreshTree');
    sut.removeCommand();

    expect(refreshSpy).toHaveBeenCalled();
  });

  it('removeCommand removes selected command from parent\'s children array', () => {
    let child = new CommandTree({});
    let parent = new CommandTree({ children: [child] });
    sut.tree = new CommandTree({
      children: [parent]
    });
    spyOn(sut, 'getSelectedTree').and.returnValue(child);
    spyOn(sut, 'getParent').and.returnValue(parent);
    let refreshSpy = spyOn(sut, 'refreshTree');
    sut.removeCommand();

    expect(parent.children.length).toBe(0);
  });

  it('getParent finds first level parent', () => {
    let target = new CommandTree({});
    sut.tree = new CommandTree({
      children: [
        target
      ]
    })
    expect(sut.getParent(target)).toBe(sut.tree);
  });

  it('getParent finds second+ level parent', () => {
    let child = new CommandTree({});
    let parent = new CommandTree({ children: [child] });
    sut.tree = new CommandTree({
      children: [
        new CommandTree({
          children: [
            parent
          ]
        })
      ]
    })
    expect(sut.getParent(child)).toBe(parent);
  });
});