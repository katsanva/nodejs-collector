var debug = require('debug')('nodejs-collector:filter');
const Ajv = require('ajv');

const schema = require('../lib/message.schema.json');
const FanoutTransform = require('../lib/fanout-transform');

module.exports = class FilterService extends FanoutTransform {
  /**
   *
   * @param {import('./fanout.service')} fanout
   * @param {string} input
   * @param {string} output
   */
  constructor(fanout, input, output) {
    super(fanout, input, output);

    this.validate = new Ajv().compile(schema);

    this.listen();
  }

  listen() {
    this.fanout.subscribe(this.input, (data) => this.filter(data));
  }

  filter(data) {
    const valid = this.validate(data);

    if (!valid) {
      debug('filtered', data, this.validate.errors);

      return;
    }

    this.fanout.publish(this.output, data);
  }
};
