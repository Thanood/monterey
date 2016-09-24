import {Container} from 'aurelia-framework';
import {TaskManagerModal} from '../../../../src/plugins/task-manager/task-manager-modal';
import {Task}             from '../../../../src/plugins/task-manager/task';
import {ApplicationState} from '../../../../src/shared/application-state';
import {Settings}         from '../../../../src/shared/settings';
import '../../setup';

describe('TaskManager modal', () => {
  let sut: TaskManagerModal;
  let state: any;

  beforeEach(() => {
    let container = new Container();
    state = {
      projects: [{
        name: 'foo',
        __meta__: {
          taskmanager: {
            tasks: []
          }
        }
      }, {
        name: 'bar',
        __meta__: {
          taskmanager: {
            tasks: []
          }
        }
      }]
    };
    container.registerInstance(ApplicationState, state);
    container.registerInstance(Settings, {
      getValue: (key) => {
        if (key === 'show-finished-tasks') {
          return true;
        }
      }
    });
    sut = <TaskManagerModal>container.get(TaskManagerModal);
  });

  it('assigns correct icon', () => {
    function addTask(status) {
      state.projects[0].__meta__.taskmanager.tasks.push(<Task>{
        status: status,
        logs: [],
        stoppable: false,
        promise: null,
        project: state.projects[0],
        addTaskLog: () => {}
      });
    }

    addTask('running');
    addTask('queued');
    addTask('stopped');
    addTask('stopped by user');
    addTask('completed');
    addTask('failed');

    sut.updateTree();

    expect(sut.taskTree[0].children[0].icon).toBe('glyphicon glyphicon-cog gly-spin');
    expect(sut.taskTree[0].children[1].icon).toBe('glyphicon glyphicon-pause');
    expect(sut.taskTree[0].children[2].icon).toBe('glyphicon glyphicon-stop');
    expect(sut.taskTree[0].children[3].icon).toBe('glyphicon glyphicon-stop');
    expect(sut.taskTree[0].children[4].icon).toBe('glyphicon glyphicon-ok');
    expect(sut.taskTree[0].children[5].icon).toBe('glyphicon glyphicon-remove');
  });

  it('shows failed and running tasks', () => {
    function addTask(status) {
      state.projects[0].__meta__.taskmanager.tasks.push(<Task>{
        status: status,
        logs: [],
        stoppable: false,
        promise: null,
        project: state.projects[0],
        addTaskLog: () => {}
      });
    }

    sut.showFinished = false;

    addTask('running');
    addTask('failed');
    addTask('completed');
    addTask('stopped');
    addTask('stopped by user');

    sut.updateTree();

    expect(sut.taskTree[0].children.length).toBe(2);
  });

  it('sets title of node to project name or task title', () => {
    function addTask(status) {
      state.projects[0].__meta__.taskmanager.tasks.push(<Task>{
        status: status,
        logs: [],
        title: 'npm install',
        stoppable: false,
        promise: null,
        project: state.projects[0],
        addTaskLog: () => {}
      });
    }

    addTask('running');

    sut.updateTree();

    expect(sut.taskTree[0].title).toBe('foo');
    expect(sut.taskTree[0].children[0].title).toBe('npm install');
  });

  it('recovers selected project', () => {
    function addTask(status) {
      state.projects[0].__meta__.taskmanager.tasks.push(<Task>{
        status: status,
        logs: [],
        title: 'npm install',
        stoppable: false,
        promise: null,
        project: state.projects[0],
        addTaskLog: () => {}
      });
    }

    addTask('running');

    sut.selectedProject = state.projects[0];
    sut.updateTree();

    expect(sut.taskTree[0].selected).toBe(true);
  });

  it('recovers selected task', () => {
    function addTask(status) {
      state.projects[0].__meta__.taskmanager.tasks.push(<Task>{
        status: status,
        logs: [],
        title: 'npm install',
        stoppable: false,
        promise: null,
        project: state.projects[0],
        addTaskLog: () => {}
      });
    }

    addTask('running');

    sut.selectedTask = state.projects[0].__meta__.taskmanager.tasks[0];
    sut.updateTree();

    expect(sut.taskTree[0].children[0].selected).toBe(true);
  });

  it('sorts tree based on how many tasks there are', () => {
    function addTask(project, status) {
      project.__meta__.taskmanager.tasks.push(<Task>{
        status: status,
        logs: [],
        stoppable: false,
        promise: null,
        project: state.projects[0],
        addTaskLog: () => {}
      });
    }

    addTask(state.projects[0], 'running');
    addTask(state.projects[0], 'queued');
    addTask(state.projects[1], 'stopped');
    addTask(state.projects[1], 'stopped by user');
    addTask(state.projects[1], 'completed');
    addTask(state.projects[1], 'failed');

    sut.updateTree();

    // project "bar" is second in the list of projects, but first in the tree
    expect(sut.taskTree[0].title).toBe('bar');
  });
});