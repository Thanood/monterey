export class RandomNumber {
  create() {
    let min = 111111111;
    let max = 999999999;
    return Math.floor(Math.random() * (max - min) + min);
  }
}