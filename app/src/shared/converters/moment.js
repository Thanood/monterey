import moment from 'moment';

export class MomentValueConverter {
  toView(date, format) {
    if (!format) format = 'LLL';
    if (!date) return undefined;

    return moment(date).format(format);
  }
}
