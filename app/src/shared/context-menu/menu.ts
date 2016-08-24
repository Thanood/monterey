import {MenuBuilder, MenuItem} from './context-menu';
import {customElement} from 'aurelia-framework';

@customElement('m-menu')
export class Menu {
  menu: MenuBuilder;
  destroy: () => void;
  
  bind(ctx: { builder: MenuBuilder, destroy: () => void}) {
    this.menu = ctx.builder;
    this.destroy = ctx.destroy;
  }

  itemClicked(e: Event, item: MenuItem) {
    if (item.onClick) {
      item.onClick(item);
    }
    if (this.menu.onClickCallback) {
      this.menu.onClickCallback(item);
    }
    this.destroy();
    e.preventDefault();
    e.stopPropagation();
  }
}