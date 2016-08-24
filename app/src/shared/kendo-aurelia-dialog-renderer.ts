import {transient} from 'aurelia-dependency-injection';
import {DOM}       from 'aurelia-framework';
import {DialogController, Renderer} from 'aurelia-dialog';

@transient()
export class KendoAureliaDialogRenderer implements Renderer {
    /**
     * Gets an anchor for the ViewSlot to insert a view into.
     * @returns A DOM element.
     */
  getDialogContainer() {
    return DOM.createElement('div');
  }
  
  /**
     * Displays the dialog.
     * @returns Promise A promise that resolves when the dialog has been displayed.
     */
  showDialog(dialogController: any) {
    let options = dialogController.settings.options;
    let aiDialog = jQuery(dialogController.slot.anchor).find('ai-dialog');

    let defaults = { 
      visible: true,
      center: true,
      modal: true,
      title: aiDialog.prop('title'),
      actions: [],
      close: () => dialogController.cancel()
    };

    // add all properties on the ai-dialog tag to the default settings
    let props = [];
    for (var i = 0, atts = aiDialog[0].attributes, n = atts.length, arr = []; i < n; i++){
      defaults[atts[i].nodeName] = atts[i].value;
    }

    options = Object.assign(defaults, options ? options : {});

    dialogController.slot.attached();

    let _window = jQuery(dialogController.slot.anchor).kendoWindow(options).data('kendoWindow');
    if (options) {
      if (options.center) {
        _window.center();
      }
    }
    return Promise.resolve();
  }
  
  /**
     * Hides the dialog.
     * @returns Promise A promise that resolves when the dialog has been hidden.
     */
  hideDialog(dialogController: any) {

    dialogController.slot.detached();
    dialogController.slot.unbind();

    let kendoWindow = jQuery(dialogController.slot.anchor).data('kendoWindow');

    kendoWindow.destroy();

    return Promise.resolve();
  }
}