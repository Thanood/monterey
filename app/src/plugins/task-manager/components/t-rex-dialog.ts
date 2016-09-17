import {autoinject, bindable, DialogController} from '../../../shared/index';

@autoinject()
export class TRexDialog {
  iframe: any;

  constructor(private dialog: DialogController) {}
}