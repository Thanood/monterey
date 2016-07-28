import * as toastr          from 'toastr';

export class Notification {
  info(message: string, title: string = undefined, overrides: ToastrOptions = undefined) {
    toastr.info(message, title, overrides);
  }
  error(message: string, title: string = undefined, overrides: ToastrOptions = undefined) {
    if (!overrides) {
      overrides = {
        showDuration: 10000,
        closeButton: true
      };
    }
    toastr.error(message, title, overrides);
  }
  warning(message: string, title: string = undefined, overrides: ToastrOptions = undefined) {
    toastr.warning(message, title, overrides);
  }
  success(message: string, title: string = undefined, overrides: ToastrOptions = undefined) {
    toastr.success(message, title, overrides);
  }
}