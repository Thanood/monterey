import {Messages, Message} from '../../../src/plugins/messages/messages';

export class MessagesFake implements Messages {
  messages: Array<Message> = [];

  add = jasmine.createSpy('add');
}

export * from '../../../src/plugins/messages/messages';