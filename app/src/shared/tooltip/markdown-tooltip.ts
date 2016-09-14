import {I18N} from 'aurelia-i18n';
import {autoinject} from 'aurelia-framework';
import * as showdown from 'showdown';

showdown.extension('targetblank', function () {
  return [
      {
        type:   'output',
        regex: '<a(.*?)>',
        replace: function (match, content) {
            return '<a target="_blank"' + content + '>';
        }
      }
  ];
});

@autoinject()
export class ToolTip {
  html: string;

  constructor(private i18n: I18N) {}

  activate(model) {
    let translated = this.i18n.tr(model.key);
    let converter = new showdown.Converter({ extensions: ['targetblank'] });
    this.html = converter.makeHtml(translated);
  }
}