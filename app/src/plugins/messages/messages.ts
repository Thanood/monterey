import {RandomNumber} from '../../shared/index';

export class Messages {
  messages: Array<Message> = [];

  add(message: Message) {
    message.id = new RandomNumber().create();
    message.created = new Date();
    this.messages.push(message);
  }
}

export interface Message {
  /**
   * Unique identifier of a message
   */
  id?: number;

  /**
   * Icon of the message (fa fa-remove)
   */
  icon?: string;

  /**
   * Short title of the message
   */
  title: string;

  /**
   * Markdown string, can be used instead of viewModel
   */
  body?: string;

  /**
   * When was the message created
   */
  created?: Date;

  /**
   * The viewModel which will be used for `<compose>`. Can be used
   * instead of the `body`
   */
  viewModel?: string;

  /**
   * Model which will be used for `<compose>`, only needed when providing a `viewModel`
   */
  model?: any;
}