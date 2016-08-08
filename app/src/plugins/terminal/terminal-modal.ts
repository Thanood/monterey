import {ApplicationState}   from '../../shared/application-state';
import {TerminalState}      from './terminal-state';
import {Main}               from '../../main/main';
import {autoinject}         from 'aurelia-framework';
import {DialogController}   from 'aurelia-dialog';

declare var System: any;
declare var process: any;
const spawn = System._nodeRequire('child_process').spawn;


@autoinject()
export class TerminalModal {

  terminal: any;
  terminalText: string = "";
  input: string = "";
  path: string = "";
  active: boolean = false;


  constructor(private dialogController: DialogController, private state: ApplicationState, private main: Main, private terminalState: TerminalState) {

  }

  async activate() {
    this.path = this.main.selectedProject.path;
    if (this.terminalState.selectedTerminal.context) {
      this.active = true;
    }
  }

  setTerminal(terminal) {
    this.terminalState.selectedTerminal = terminal;
    this.active = true;
    this.scroll();
  }

  addTerminal() {
    this.startTerminal()
  }

  startTerminal() {
    let cmd = process.platform === 'win32' ? 'cmd' : 'bash';

    let terminal = {context: null, terminalText: ""};
    terminal.context = spawn(cmd, {
      cwd: this.path
    });

    terminal.context.stdout.on('data', (data) => {
      terminal.terminalText = terminal.terminalText + data;
      this.scroll();
    });

    terminal.context.stderr.on('data', (data) => {
      terminal.terminalText = terminal.terminalText + data;
      this.scroll();
    });

    terminal.context.on('exit', (code) => {
      terminal.terminalText = terminal.terminalText + 'child process exited with code ' + code + '\n';
      this.terminalState.terminals.forEach((t, i)=> {
        if (t.context.pid == terminal.context.pid) {
          this.terminalState.terminals.splice(i, 1);
          this.terminalState.selectedTerminal.context = null;
          this.active = false;
          this.scroll();
        }
      })
    });

    this.terminalState.terminals.push(terminal);
    this.terminalState.selectedTerminal = terminal;
    this.active = true;

  }


  scroll() {
    setTimeout(()=> {
      let textarea = document.getElementById('terminal-vr');
      if (textarea) {
        textarea.scrollTop = textarea.scrollHeight;
      }
    }, 300)
  }


  closeTerminal() {
    if (this.terminalState.selectedTerminal.context) {
      this.terminalState.killProcess(this.terminalState.selectedTerminal.context.pid);
    }
  }


  keydown(e) {
    //listen for contrl+c
    if (e.ctrlKey && e.keyCode === 67) {
      this.closeTerminal();
    }

    if (e.keyCode === 13) {
      this.terminalState.selectedTerminal.context.stdin.write(`${this.input}\n`);
      this.input = "";
      return false;
    } else {
      return true;
    }
  }


}
