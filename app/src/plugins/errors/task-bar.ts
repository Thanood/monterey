import {autoinject, useView, BindingEngine, Disposable} from 'aurelia-framework';
import {Errors}     from './errors';
import {ErrorModal} from './error-modal';
import {withModal}  from '../../shared/index';

@useView('../task-bar/default-item.html')
@autoinject()
export class TaskBar {
  text: string;
  visible: boolean;
  subscription: Disposable;
  icon = 'fa fa-warning';

  constructor(private errors: Errors, private bE: BindingEngine) {
    this.subscription = bE.collectionObserver(errors.errors).subscribe(() => this.update());
    this.update();
  }

  update() {
    this.text = '' + this.errors.errors.length;
    this.visible = this.errors.errors.length > 0;
  }

  @withModal(ErrorModal)
  onClick() {}

  detached() {
    this.subscription.dispose();
  }
}