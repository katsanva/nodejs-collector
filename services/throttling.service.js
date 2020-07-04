var debug = require('debug')('nodejs-collector:throttled-receiver');

const { THROTTLE_CACHE_SIZE, THROTTLE_TIMEOUT } = require('../lib/constants');
const FanoutTransform = require('../lib/fanout-transform');

module.exports = class ThrottlingService extends FanoutTransform {
  /**
   *
   * @param {import('./fanout.service')} fanout
   * @param {string} input
   * @param {string} output
   */
  constructor(fanout, input, output) {
    super(fanout, input, output);

    this.cache = [];
    this.timeout = undefined;

    this.listen();
  }

  listen() {
    this.fanout.subscribe(this.input, (data) => this.throttle(data));
  }

  throttle(data) {
    debug('receive', this.cache.length);

    if (this.cache.length === THROTTLE_CACHE_SIZE) {
      clearTimeout(this.timeout);

      this.sync();

      this.cache.push(data);

      return;
    }

    this.cache.push(data);

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => this.sync(), THROTTLE_TIMEOUT);

    return;
  }

  sync() {
    debug('sync', this.cache.length);

    this.cache.forEach((data) => this.fanout.publish(this.output, data));

    this.cache.length = 0;
  }
};
