import {customAttribute, bindable, autoinject} from 'aurelia-framework';
import {ToolTip}                     from './markdown-tooltip';
import {TooltipService}              from './tooltip-service';

@autoinject()
@customAttribute('tooltip')
export class TooltipAttribute {
  value: string;
  delay = 1000;
  showTimeout: any;

  constructor(private element: Element,
              private tooltip: TooltipService) {
    element.addEventListener('mouseenter', this.handleTooltip.bind(this));
    element.addEventListener('mouseleave', this.handleTooltip.bind(this));
  }

  handleTooltip(event: MouseEvent) {
    if (!this.value) return;

    const { type } = event;

    switch (type) {
      case 'mouseenter':
        this.showTimeout = setTimeout(() => this.show(), this.delay);
        break;
      case 'mouseleave':
        clearTimeout(this.showTimeout);
        setTimeout(() => this.tooltip.hide(), this.delay);
        break;
    }
  }

  show() {
    this.tooltip.show({ viewModel: ToolTip, model: { key: this.value }, target: this.element });
  }

  detached() {
    clearTimeout(this.showTimeout);
    this.tooltip.hide();
    this.element.removeEventListener('mouseenter', this.handleTooltip);
    this.element.removeEventListener('mouseleave', this.handleTooltip);
  }
}