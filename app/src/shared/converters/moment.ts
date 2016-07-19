import 'moment';

export class MomentValueConverter {
  toView(date: Date, format: string) {
    if (!format) format = 'LLL';
    if (!date) return undefined;

    return moment(date).format(format);
  }
}
