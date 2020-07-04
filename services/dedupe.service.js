var debug = require('debug')('nodejs-collector:dedupe');
const LRU = require('lru-cache');
const hasher = require('node-object-hash');
const hashSortCoerce = hasher({ sort: true, coerce: true });
const FanoutTransform = require('../lib/fanout-transform');

const { DEDUPE_INTERVAL } = require('../lib/constants');

module.exports = class DedupeService extends FanoutTransform {
  /**
   *
   * @param {import('./fanout.service')} fanout
   * @param {string} input
   * @param {string} output
   */
  constructor(fanout, input, output) {
    super(fanout, input, output);

    this.cache = new LRU({ maxAge: DEDUPE_INTERVAL });

    this.listen();
  }

  listen() {
    this.fanout.subscribe(this.input, (data) => this.dedupe(data));
  }

  dedupe(data) {
    const hash = hashSortCoerce.hash(data.data);

    if (this.cache.has(hash)) {
      debug('cache hit', data);

      return;
    }

    this.cache.set(hash, 1, DEDUPE_INTERVAL);

    this.fanout.publish(this.output, data);
  }
};
