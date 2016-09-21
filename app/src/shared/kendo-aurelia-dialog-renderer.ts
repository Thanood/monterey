import {transient, autoinject}      from 'aurelia-dependency-injection';
import {EventAggregator}            from 'aurelia-event-aggregator';
import {DOM}                        from 'aurelia-framework';
import {DialogController, Renderer} from 'aurelia-dialog';

/**
 * The KendoAureliaDialogRenderer is an adapter for the aurelia-dialog, rendering a Kendo dialog
 * instead of the default dialog of aurelia-dialog
 */
@transient()
@autoinject()
export class KendoAureliaDialogRenderer implements Renderer {

  constructor(private ea: EventAggregator) {}

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
    for (let i = 0, atts = aiDialog[0].attributes, n = atts.length, arr = []; i < n; i++) {
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

    this.ea.publish('DialogClosed', { controller: dialogController});

    return Promise.resolve();
  }
}