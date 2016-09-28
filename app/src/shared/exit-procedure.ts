import {OS, SESSION} from 'monterey-pal';
import {DOM} from 'aurelia-pal';

export class ExitProcedure {
  private cleanedup = false;

  constructor() {
    // onbeforeunload is called before monterey is quit
    // which you can cancel by setting the returnValue
    // onbeforeunload is executed synchronously while we want to asynchrounsly cleanup
    // so we cancel the first time it is called, cleanup and then
    // we close the window ourselves when cleanup is finished
    window.onbeforeunload = (e) => {
      this._cleanup(e);
    };
  }

  async _cleanup(e) {
    if (!this.cleanedup) {
      let promises = [];
      for (let i = OS.processes.length; i > 0; i--) {
        promises.push(OS.kill(OS.processes[i - 1]));
      }

      if (promises.length > 0) {
        this.cleanedup = true;
        e.returnValue = 'do not close';
        console.log('cleaning up...');
        Promise.all(promises).then(() => {
          if (SESSION.getEnv() !== 'development') {
            window.close();
          } else {
            location.reload();
          }
        });
      } // else, quit immediately
    }
  }
}