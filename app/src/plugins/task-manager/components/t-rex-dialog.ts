import {autoinject, bindable} from 'aurelia-framework';
import {DialogController}     from 'aurelia-dialog';

@autoinject()
export class TRexDialog {
  iframe: any;

  constructor(private dialog: DialogController) {}
}