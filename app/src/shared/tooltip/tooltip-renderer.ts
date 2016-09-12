import { ViewSlot, View, Controller } from 'aurelia-templating';
import { DOM } from 'aurelia-pal';

export class TooltipRenderer {
  _element: Element;
  _tether: Tether;

  show(viewSlot: ViewSlot, target: Element) {
    viewSlot.attached();

    this._tether = new Tether({
      element: this._element,
      target,
      classes: {
        element: false,
        target: false,
        enabled: false,
      },
      classPrefix: 'tooltip',
      attachment: 'bottom left',
      constraints: [{ to: 'window', attachment: 'together' }]
    });
    this._tether.position();
  }

  getContainer() {
    const element = DOM.createElement('tooltip');
    DOM.appendNode(element);
    return element;
  }

  hide(viewSlot: ViewSlot) {
    viewSlot.unbind();
    viewSlot.detached();

    // stop Tether from caring about this.element
    // do not delete the reference to this.tether because it will probably be used again
    if (this._tether) {
      this._tether.destroy();
    }
    DOM.removeNode(this._element);
  }
}
