declare module "context-menu/context-menu" {
    import { TemplatingEngine, View } from 'aurelia-templating';
    import {MenuBuilder} from 'context-menu/menu';
    export class ContextMenu {
        templatingEngine: TemplatingEngine;
        activeContextMenu: View;
        constructor(templatingEngine: TemplatingEngine);
        attach(element: Element, onInit: (builder: MenuBuilder, clickedElement: Element) => void): void;
        onContextMenu(e: MouseEvent, onInit: (builder: MenuBuilder, clickedElement: Element) => void): void;
        offset(obj: any): any;
        destroyContextMenus(): void;
        detach(element: Element): void;
    }
}

declare module "context-menu/menu" {
    export class MenuBuilder {
        items: Array<MenuItem>;
        onClickCallback: (item: MenuItem) => void;
        data: any;
        addItem(item: MenuItem): this;
        addSeparator(): this;
        onClick(callback: (item: MenuItem) => void): void;
    }
    export interface MenuItem {
        title?: string;
        icon?: string;
        separator?: boolean;
        onClick?: (item: MenuItem) => void;
    }
}