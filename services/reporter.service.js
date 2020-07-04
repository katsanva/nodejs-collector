var debug = require('debug')('nodejs-collector:reporter');

module.exports = class ReporterService {
  /**
   *
   * @param {import('./fanout.service')} fanout
   * @param {string} input
   */
  constructor(fanout, input) {
    this.fanout = fanout;
    this.input = input;

    this.listen();
  }

  listen() {
    this.fanout.subscribe(this.input, (data) => this.report(data));
  }

  report(data) {
    console.log(data);
  }
};
