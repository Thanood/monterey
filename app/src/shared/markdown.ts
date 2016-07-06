import {bindable} from 'aurelia-framework';
import * as showdown from 'showdown';

export class Markdown {
    @bindable markdown;
    html: string;

    markdownChanged() {
        let converter = new showdown.Converter();
        this.html = converter.makeHtml(this.markdown);
    }
}