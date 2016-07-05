export class LimitTextSizeValueConverter {
  toView(text, amountOfChars) {
    if (text.length > amountOfChars) {
      return text.slice(0, amountOfChars) + '...';
    }

    return text;
  }
}
