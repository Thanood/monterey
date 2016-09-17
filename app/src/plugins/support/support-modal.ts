import {Tour} from '../../main/components/tour';
import {Main} from '../../main/main';
import {MontereyRegistries, autoinject, FS, ELECTRON,  DialogController} from '../../shared/index';

@autoinject()
export class SupportModal {

  books: Array<Book> = [];
  selectedBook: Book;
  logFolder: string;

  constructor(private dialogController: DialogController,
              private registries: MontereyRegistries,
              private main: Main,
              private tour: Tour) {}

  async activate() {
    this.books = (await this.registries.getGitbooks()).books;
    let packageJSON = JSON.parse(await FS.readFile(FS.join(FS.getRootDir(), 'package.json')));
    this.logFolder = FS.join(ELECTRON.getPath('userData'), 'logs');
  }

  startTour() {
    this.main.returnToPluginList();
    this.dialogController.cancel();
    this.tour.start();
  }

  openBook() {
    window.open(this.selectedBook.url, '_blank');
  }
}

export interface Book {
  name: string;
  url: string;
}