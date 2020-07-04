var debug = require('debug')('nodejs-collector:receiver');

module.exports = class ReceiverService {
  /**
   *
   * @param {import('./throttled-receiver.service')} receiver
   */
  constructor(receiver) {
    this.receiver = receiver;
  }

  receive(data) {
    this.receiver.receive(data);
  }
};
