export class LimitTextSizeValueConverter {
  toView(text: string, amountOfChars: number) {
    if (!text) return '';

    if (text.length > amountOfChars) {
      return text.slice(0, amountOfChars) + '...';
    }

    return text;
  }
}
