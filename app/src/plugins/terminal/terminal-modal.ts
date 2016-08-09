import {ApplicationState}   from '../../shared/application-state';
import {TerminalState}      from './terminal-state';
import {Main}               from '../../main/main';
import {autoinject}         from 'aurelia-framework';
import {DialogController}   from 'aurelia-dialog';

declare var System: any;
declare var process: any;
const spawn = System._nodeRequire('child_process').spawn;
const Convert = System._nodeRequire('ansi-to-html');



@autoinject()
export class TerminalModal {

  terminal: any;
  terminalText: string = "";
  input: string = "";
  path: string = "";
  active: boolean = false;
  convert:any;


  constructor(private dialogController: DialogController, private state: ApplicationState, private main: Main, private terminalState: TerminalState) {
    this.convert = new Convert({
      fg: '#FFF',
      bg: '#000',
      newline: false,
      escapeXML: false,
      stream: false
    });
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

  replaceAll = function (text, search, replacement) {
    return text.replace(new RegExp(search, 'g'), replacement);
  };

  processData(terminal: any, str: string) {

    str = this.replaceAll(str, ">", "&gt");
    str = this.replaceAll(str, "<", "&lt");

    terminal.terminalText = terminal.terminalText + this.convert.toHtml(str);

    let textarea = document.getElementById('terminal-vr');
    textarea.innerHTML = '<span>' + terminal.terminalText + '</span>';
  }

  startTerminal() {
    let cmd = process.platform === 'win32' ? 'cmd' : 'bash';

    let terminal = {context: null, terminalText: ""};
    terminal.context = spawn(cmd, {
      cwd: this.path,
      shell: true,
      env: Object.assign(process.env, {FORCE_COLOR: true})
    });

    terminal.context.stdout.on('data', (data) => {
      this.processData(terminal, data.toString());
      this.scroll();
    });

    terminal.context.stderr.on('data', (data) => {
      this.processData(terminal, data.toString());
      this.scroll();
    });

    terminal.context.on('exit', (code) => {
      this.processData(terminal, 'child process exited with code ' + code + '\n');

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
