import {autoinject}         from 'aurelia-framework';
import {DialogController}   from 'aurelia-dialog';
import {ApplicationState}   from '../../shared/index';
import {TerminalState}      from './terminal-state';

@autoinject()
export class TerminalModal {

  constructor(private dialogController: DialogController, private state: ApplicationState, private terminalState: TerminalState) {

  }

  attached() {
    // reload instance of out xterm
    setTimeout(() => {
      this.terminalState.terminals.forEach((term) => {
        let element = document.createElement('DIV');
        term.element.appendChild(term.xterm.element);
      });
    }, 100);
  }


  updateTitle(e) {
    if (this.terminalState.selectedTerminal) {
      this.terminalState.selectedTerminal.name = e.target.innerText;
      return true;
    } else {
      return false;
    }
  }

  setTerminal(terminal) {
    if (this.terminalState.selectedTerminal) {
      this.terminalState.selectedTerminal.active = false;
    }
    this.terminalState.selectedTerminal = terminal;
    this.terminalState.selectedTerminal.active = true;
  }


  addTerminal() {
    this.generateTerminal();
  }


  generateTerminal() {
    let id: string = 'terminal-' + this.terminalState.getID();
    let element = document.createElement('DIV');
    this.terminalState.terminals.push({
      active: true,
      xterm: null,
      pty: null,
      id: id,
      pid: 'generating',
      element: element
    });

    setTimeout((e) => {
      this.terminalState.createPTY(id);
    }, 200);
  }


  closeTerminal() {
    if (this.terminalState.selectedTerminal && this.terminalState.selectedTerminal.pty) {
      this.terminalState.selectedTerminal.pty.kill();
    }
  }
}
