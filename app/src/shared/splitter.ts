import {autoinject, bindable, customAttribute} from 'aurelia-framework';

@customAttribute('splitter')
@autoinject()
export class Splitter {

  @bindable handle: Element;

  constructor(private element: Element) {}

  attached() {
    if (!this.handle.classList.contains('splitter')) {
      this.handle.classList.add('splitter');
    }

    (<any>$)(this.element).resizable({
      handleSelector: $(this.handle),
      resizeHeight: false
    });
  }
}