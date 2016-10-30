import {autoinject} from 'aurelia-framework';
import {Main}       from '../../main/main';

@autoinject()
export class Screen {
  tabs = [
    { element: null, title: 'Miscellaneous', viewModel: './components/miscellaneous' },
    { element: null, title: 'Tools layout', viewModel: './components/layout' },
    { element: null, title: 'Github', viewModel: './components/github' },
    { element: null, title: 'NPM', viewModel: './components/npm' },
    { element: null, title: 'Endpoints', viewModel: './components/endpoints' },
    { element: null, title: 'Theme', viewModel: './components/themes' },
  ];

  constructor(private main: Main) {
  }

  attached() {
    $(this.tabs[0].element).tab('show');
    $(this.tabs[0].element).show();
  }

  goBack() {
    this.main.returnToPluginList();
  }
}
