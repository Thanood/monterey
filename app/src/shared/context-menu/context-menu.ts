import {TemplatingEngine, ViewResources, View} from 'aurelia-templating';
import {createOverrideContext}           from 'aurelia-binding';
import {inject}                          from 'aurelia-framework';

@inject(TemplatingEngine)
export class ContextMenu {
  templatingEngine: TemplatingEngine;
  activeContextMenu: View;
  
  constructor(templatingEngine: TemplatingEngine) {
    this.templatingEngine = templatingEngine;
  }

  attach(element: Element, onInit: (builder: MenuBuilder, clickedElement: Element) => void) {
    // any click should destroy the context menu
    document.addEventListener('click', (e) => this.destroyContextMenus());

    // list for the contextmenu event on the element (and therefore all child elements);
    element.addEventListener('contextmenu', e => this.onContextMenu(<MouseEvent>e, onInit));
  }

  onContextMenu(e: MouseEvent, onInit: (builder: MenuBuilder, clickedElement: Element) => void) {
    // destroy all other context menu's
    this.destroyContextMenus();

    let target = <Element>e.target;

    
    let builder = new MenuBuilder();
    onInit(builder, target);

    if (builder.items.length === 0) {
      return
    }

    
    // create <menu></menu>
    let menu = document.createElement('m-menu');

    // position the contextmenu under the cursor
    menu.style.left = (e.clientX + 5) + 'px'; 
    menu.style.top = (e.clientY + 5) + 'px'; 
    menu.style.width = '200px';

    // add menu to the dom
    document.body.appendChild(menu);



    // compile <menu></menu> custom element
    let view = this.templatingEngine.enhance({
      element: menu,
      bindingContext: { builder: builder, destroy: () => this.destroyContextMenus() },
      overrideContext: createOverrideContext(this)
    });

    view.attached();

    // store menu and target instance on the view
    (<any>menu).view = view;
    (<any>view).menu = menu;

    // keep reference to the contextmenu 
    this.activeContextMenu = view;

    e.preventDefault();
  }

  offset(obj) {
    var curleft = 0,
        curtop = 0;
    if (obj.getClientRects) {
      return obj.getClientRects()[0];
    }
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
      obj = obj.offsetParent;
    } while (obj);
    return {
      left: curleft,
      top: curtop
    };
  }

  destroyContextMenus() {
    if (!this.activeContextMenu) return;

    let view = this.activeContextMenu;
    // cleanup <menu> custom element
    view.unbind();
    view.detached();

    // remove <menu> from DOM
    document.body.removeChild((<any>view).menu);

    this.activeContextMenu = null;
  }

  detach(element: Element) {
    element.removeEventListener('contextmenu');
  }
}

export class MenuBuilder {
  items: Array<MenuItem> = [];
  onClickCallback: (item: MenuItem) => void;
  data: any;

  /**
   * Adds a menuitem to the menubar
   */
  addItem(item: MenuItem) {
    this.items.push(item);
    return this;
  }

  /**
   * Adds a separator to the menubar
   */
  addSeparator() {
    this.items.push({ separator: true});
    return this;
  }

  /**
   * Called when any menu item gets clicked
   */
  onClick(callback: (item: MenuItem) => void) {
    this.onClickCallback = callback;
  }
}

export interface MenuItem {
  /**
   * Visible text in the menu item
   */
  title?: string;

  /**
   * Icon shown at the front of the menu item
   */
  icon?: string;

  /**
   * Is this a seperator?
   */
  separator?: boolean;

  /**
   * This callback is called when this menu item is clicked
   */
  onClick?: (item: MenuItem) => void;
}