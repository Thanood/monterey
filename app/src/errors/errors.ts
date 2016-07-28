import {RandomNumber} from '../shared/random-number';

export class Errors {
  errors = [];

  add(error) {
    error.id = new RandomNumber().create();
    this.errors.push(error);
    console.log(this.errors);
  }
}