var debug = require('debug')('nodejs-collector:dedupe');
const LRU = require('lru-cache');
const hasher = require('node-object-hash');
const hashSortCoerce = hasher({ sort: true, coerce: true });

const {
  TOPIC_DATA_RECEIVED,
  TOPIC_DATA_DEDUPED,
  DEDUPE_INTERVAL,
} = require('../lib/constants');

module.exports = class DedupeService {
  /**
   *
   * @param {import('./fanout.service')} fanout
   */
  constructor(fanout) {
    this.fanout = fanout;
    this.cache = new LRU({ maxAge: DEDUPE_INTERVAL });

    this.listen();
  }

  listen() {
    this.fanout.subscribe(TOPIC_DATA_RECEIVED, (data) => this.dedupe(data));
  }

  dedupe(data) {
    const hash = hashSortCoerce.hash(data.data);

    if (this.cache.has(hash)) {
      debug('cache hit', data);

      return;
    }

    this.cache.set(hash, 1, DEDUPE_INTERVAL);

    this.fanout.publish(TOPIC_DATA_DEDUPED, data);
  }
};
