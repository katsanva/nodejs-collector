var debug = require('debug')('nodejs-collector:receiver');
const ThrottlingService = require('./throttling.service');
const FilterService = require('./filter.service');
const DedupeService = require('./dedupe.service');
const {
  TOPIC_DATA_FILTERED,
  TOPIC_DATA_DEDUPED,
  TOPIC_INPUT,
} = require('../lib/constants');

module.exports = class ReceiverFacadeService {
  /**
   *
   * @param {import('./fanout.service')} fanout
   * @param {string} output
   */
  constructor(fanout, output) {
    this.fanout = fanout;
    this.output = output;

    this.throttle = new ThrottlingService(fanout, TOPIC_DATA_FILTERED, output);
    this.filter = new FilterService(
      fanout,
      TOPIC_DATA_DEDUPED,
      TOPIC_DATA_FILTERED,
    );
    this.dedupe = new DedupeService(fanout, TOPIC_INPUT, TOPIC_DATA_DEDUPED);
  }

  receive(data) {
    this.fanout.publish(TOPIC_INPUT, data);
  }
};
