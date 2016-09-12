import {RandomNumber} from '../../../src/shared/random-number';

describe('RandomNumber', () => {
  it('generates 10 digit random numbers', () => {
    let randomNumber = new RandomNumber();

    let numbers: Array<number> = [];
    while(numbers.length < 1000) {
      numbers.push(randomNumber.create());
    }

    for(let x = 0; x < numbers.length; x++) {
      expect(('' + numbers[x]).length).toBe(9);
    }

    let map = new Map<number, number>();
    for(let x = 0; x < numbers.length; x++) {
      if (map.has(numbers[x])) {
        map.set(numbers[x], map.get(numbers[x] + 1));
      }
      else {
        map.set(numbers[x], 1);
      }
    }

    let counts = Object.keys(map);
    expect(counts.filter(x => parseInt(x, 2) > 1).length).toBe(0);
  });
});