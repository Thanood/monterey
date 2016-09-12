import { ViewSlot, View, Controller } from 'aurelia-templating';
import { DOM } from 'aurelia-pal';

export class TooltipRenderer {
  _element: Element;
  _tether: Tether;
  _viewSlot: ViewSlot;
  tooltipHovering: boolean;

  show(target: Element) {
    this._viewSlot.attached();

    this._element.addEventListener('mouseenter', this.tooltipHovered.bind(this));
    this._element.addEventListener('mouseleave', this.tooltipHovered.bind(this));

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

  tooltipHovered(e: MouseEvent) {
    if (e.type === 'mouseenter') {
      this.tooltipHovering = true;
    }
    if (e.type === 'mouseleave') {
      if (this.tooltipHovering) {
        this.tooltipHovering = false;
        this.hide();
      }
      this.tooltipHovering = false;
    }
  }

  hide() {
    if (!this.tooltipHovering) {
      this._viewSlot.unbind();
      this._viewSlot.detached();

      this._element.removeEventListener('mouseenter', this.tooltipHovered);
      this._element.removeEventListener('mouseleave', this.tooltipHovered);

      // stop Tether from caring about this.element
      // do not delete the reference to this.tether because it will probably be used again
      if (this._tether) {
        this._tether.destroy();
      }
      DOM.removeNode(this._element);
    }
  }
}
