import {autoinject}         from 'aurelia-framework';
import {DialogController}   from 'aurelia-dialog';
import {MontereyRegistries} from '../../shared/monterey-registries';
import {FS}                 from 'monterey-pal';

@autoinject()
export class SupportModal {

  books: Array<Book> = [];
  selectedBook: Book;

  constructor(private dialogController: DialogController,
              private registries: MontereyRegistries) {}

  async activate() {
    this.books = (await this.registries.getGitbooks()).books;
    let packageJSON = JSON.parse(await FS.readFile(FS.join(FS.getRootDir(), 'package.json')));
  }

  openBook() {
    window.open(this.selectedBook.url, '_blank');
  }
}

export interface Book {
  name: string;
  url: string;
}