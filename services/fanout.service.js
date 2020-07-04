var debug = require('debug')('nodejs-collector:fanout');

class FanoutService {
  /**
   *
   * @param {import('events')} ee
   */
  constructor(ee) {
    this.ee = ee;
  }

  async subscribe(event, handler) {
    debug('subscribe', event);

    this.ee.on(event, handler);
  }

  async publish(event, data) {
    debug('publish', event, data);

    this.ee.emit(event, data);
  }
}

module.exports = FanoutService;
