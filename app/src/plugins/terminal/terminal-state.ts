declare var System: any;
const treeKill = System._nodeRequire('tree-kill');

export class TerminalState {
  terminals: any;
  selectedTerminal: any;

  constructor() {
    this.terminals = [];
    this.selectedTerminal = {};
  }

  killProcess(pid) {
    treeKill(pid, 'SIGKILL');
  }

  //this need to be called when monetery quit!
  killAll() {
    this.terminals.forEach((terminal)=> {
      this.killProcess(terminal.context.pid);
    })
  }

}
