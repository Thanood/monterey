import 'aurelia-polyfills';
import {initialize} from 'aurelia-pal-browser';
initialize();

import {configureLogger} from './fakes/index';
configureLogger();

beforeEach(() => {
  configureLogger();
});