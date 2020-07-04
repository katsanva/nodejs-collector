var debug = require('debug')('nodejs-collector:receiver');

const { TOPIC_DATA_RECEIVED } = require('../lib/constants');

module.exports = class ReceiverService {
  /**
   *
   * @param {import('./fanout.service')} fanout
   */
  constructor(fanout) {
    this.fanout = fanout;
  }

  receive(data) {
    this.fanout.publish(TOPIC_DATA_RECEIVED, data);
  }
};
