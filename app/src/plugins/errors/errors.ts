import {RandomNumber} from '../../shared/index';

export class Errors {
  errors = [];

  add(error) {
    error.id = new RandomNumber().create();
    this.errors.push(error);
  }
}