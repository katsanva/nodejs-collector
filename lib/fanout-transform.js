module.exports = class FanoutTransform {
  /**
   *
   * @param {import('../services/fanout.service')} fanout
   * @param {string} input
   * @param {string} output
   */
  constructor(fanout, input, output) {
    this.fanout = fanout;
    this.input = input;
    this.output = output;
  }
};
