var debug = require('debug')('nodejs-collector:throttled-receiver');

const {
  TOPIC_DATA_RECEIVED,
  RECEIVER_LENGTH,
  RECEIVER_TIMEOUT,
} = require('../lib/constants');

module.exports = class ThrottledReceiverService {
  /**
   *
   * @param {import('./fanout.service')} fanout
   */
  constructor(fanout) {
    this.fanout = fanout;
    this.cache = [];
    this.timeout = undefined;
  }

  receive(data) {
    debug('receive', this.cache.length);

    if (this.cache.length === RECEIVER_LENGTH) {
      clearTimeout(this.timeout);

      this.sync();

      return;
    }

    this.cache.push(data);

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => this.sync(), RECEIVER_TIMEOUT);

    return;
  }

  sync() {
    debug('sync', this.cache.length);

    this.cache.forEach((data) =>
      this.fanout.publish(TOPIC_DATA_RECEIVED, data),
    );

    this.cache.length = 0;
  }
};
