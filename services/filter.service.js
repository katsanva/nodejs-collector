var debug = require('debug')('nodejs-collector:filter');

const {
  TOPIC_DATA_RECEIVED,
  TOPIC_DATA_FILTERED,
} = require('../lib/constants');
const schema = require('./message.schema.json');

module.exports = class FilterService {
  /**
   *
   * @param {import('./fanout.service')} fanout
   * @param {import('ajv').Ajv} ajv
   */
  constructor(fanout, ajv) {
    this.fanout = fanout;
    this.validate = ajv.compile(schema);

    this.listen();
  }

  listen() {
    this.fanout.subscribe(TOPIC_DATA_RECEIVED, (data) => this.filter(data));
  }

  filter(data) {
    const valid = this.validate(data);

    if (!valid) {
      debug('filtered', data, this.validate.errors);

      return;
    }

    this.fanout.publish(TOPIC_DATA_FILTERED, data);
  }
};
